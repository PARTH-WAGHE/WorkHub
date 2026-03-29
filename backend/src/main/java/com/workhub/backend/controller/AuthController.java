package com.workhub.backend.controller;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import com.workhub.backend.entity.Employee;
import com.workhub.backend.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allow deployed frontend
public class AuthController {

  private static final Logger log = LoggerFactory.getLogger(AuthController.class);
  private static final long GOOGLE_STATE_TTL_MS = Duration.ofMinutes(10).toMillis();
  private static final long GOOGLE_LOGIN_TOKEN_TTL_MS = Duration.ofMinutes(5).toMillis();

  private final EmployeeRepository repo;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
  private final RestTemplate restTemplate = new RestTemplate();
  private final ConcurrentMap<String, OAuthState> googleStateStore = new ConcurrentHashMap<>();
  private final ConcurrentMap<String, PendingGoogleLogin> pendingGoogleLogins = new ConcurrentHashMap<>();

  @Value("${workhub.google.client-id:}")
  private String googleClientId;

  @Value("${workhub.google.client-secret:}")
  private String googleClientSecret;

  @Value("${workhub.google.redirect-uri:}")
  private String googleRedirectUri;

  @Value("${workhub.google.frontend-url:http://localhost:5173}")
  private String googleFrontendUrl;

  // Hardcoded admin credentials
  private static final String ADMIN_EMAIL = "admin@workhub.com";
  private static final String ADMIN_PASSWORD = "admin";

  private record OAuthState(String mode, long expiresAt) {
  }

  private record PendingGoogleLogin(Employee employee, long expiresAt) {
  }

  public AuthController(EmployeeRepository repo) {
    this.repo = repo;
  }

  public record LoginRequest(String email, String password) {
  }

  public record GoogleAuthRequest(String credential) {
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    try {
      // Basic validation
      String email = (req != null && req.email() != null) ? req.email().trim().toLowerCase() : null;
      String password = (req != null) ? req.password() : null;
      if (email == null || email.isBlank() || password == null || password.isBlank()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
      }

      // Check for hardcoded admin first (normalized)
      if (ADMIN_EMAIL.equalsIgnoreCase(email) && ADMIN_PASSWORD.equals(password)) {
        Employee admin = new Employee();
        admin.setId(0L);
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail(ADMIN_EMAIL);
        admin.setRole("ADMIN");
        admin.setActive(true);
        return ResponseEntity.ok(admin);
      }
      if (ADMIN_EMAIL.equalsIgnoreCase(email)) {
        return ResponseEntity.status(401).body(Map.of("error", "Invalid admin credentials."));
      }

      var userOpt = repo.findByEmail(email);
      if (userOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("error", "Account not found."));
      }

      Employee employee = userOpt.get();
      if (employee.getPasswordHash() == null || !passwordEncoder.matches(password, employee.getPasswordHash())) {
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials."));
      }

      if (employee.getRole() == null || employee.getRole().isEmpty()) {
        employee.setRole("USER");
      }
      return ResponseEntity.ok(employee);
    } catch (Exception ex) {
      log.error("Login failed for email={}", req != null ? req.email() : "null", ex);
      return ResponseEntity.status(500).body(Map.of("error", "Internal server error. Please try again later."));
    }
  }

  @PostMapping("/google")
  public ResponseEntity<?> google(@RequestBody GoogleAuthRequest req) {
    try {
      String credential = (req != null && req.credential() != null) ? req.credential().trim() : null;
      if (credential == null || credential.isBlank()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Google credential is required."));
      }
      Employee user = authenticateGoogleIdToken(credential, "register");
      return ResponseEntity.ok(user);
    } catch (Exception ex) {
      log.error("Google login failed", ex);
      return ResponseEntity.status(500).body(Map.of("error", "Internal server error. Please try again later."));
    }
  }

  @GetMapping("/google/start")
  public ResponseEntity<?> googleStart(@RequestParam(defaultValue = "login") String mode) {
    String normalizedMode = normalizeMode(mode);

    if (isGoogleOAuthCodeFlowConfigMissing()) {
      return redirectToFrontendWithError(normalizedMode, "Google sign-in is not configured on the server.");
    }

    pruneExpiredGoogleState();
    String state = UUID.randomUUID().toString();
    long expiresAt = System.currentTimeMillis() + GOOGLE_STATE_TTL_MS;
    googleStateStore.put(state, new OAuthState(normalizedMode, expiresAt));

    String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
        .queryParam("client_id", googleClientId)
        .queryParam("redirect_uri", googleRedirectUri)
        .queryParam("response_type", "code")
        .queryParam("scope", "openid email profile")
        .queryParam("state", state)
        .queryParam("prompt", "select_account")
        .build()
        .encode()
        .toUriString();

    return redirectTo(authUrl);
  }

  @GetMapping("/google/callback")
  public ResponseEntity<?> googleCallback(
      @RequestParam(required = false) String code,
      @RequestParam(required = false) String state,
      @RequestParam(name = "error", required = false) String providerError,
      @RequestParam(name = "error_description", required = false) String providerErrorDescription) {

    if (providerError != null && !providerError.isBlank()) {
      String message = firstNonBlank(providerErrorDescription, "Google sign-in was cancelled.");
      return redirectToFrontendWithError("login", message);
    }

    if (state == null || state.isBlank() || code == null || code.isBlank()) {
      return redirectToFrontendWithError("login", "Invalid Google sign-in response.");
    }

    pruneExpiredGoogleState();
    OAuthState stateInfo = googleStateStore.remove(state);
    if (stateInfo == null || isExpired(stateInfo.expiresAt())) {
      return redirectToFrontendWithError("login", "Google sign-in session expired. Please try again.");
    }

    try {
      String idToken = exchangeAuthCodeForIdToken(code);
      Employee user = authenticateGoogleIdToken(idToken, stateInfo.mode());

      pruneExpiredPendingGoogleLogins();
      String loginToken = UUID.randomUUID().toString();
      long expiresAt = System.currentTimeMillis() + GOOGLE_LOGIN_TOKEN_TTL_MS;
      pendingGoogleLogins.put(loginToken, new PendingGoogleLogin(user, expiresAt));

      return redirectToFrontendWithToken(stateInfo.mode(), loginToken);
    } catch (IllegalArgumentException ex) {
      return redirectToFrontendWithError(stateInfo.mode(), ex.getMessage());
    } catch (Exception ex) {
      log.error("Google callback failed", ex);
      return redirectToFrontendWithError(stateInfo.mode(), "Google sign-in failed. Please try again.");
    }
  }

  @GetMapping("/google/exchange")
  public ResponseEntity<?> googleExchange(@RequestParam("token") String token) {
    if (token == null || token.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Google login token is required."));
    }

    pruneExpiredPendingGoogleLogins();
    PendingGoogleLogin pending = pendingGoogleLogins.remove(token);
    if (pending == null || isExpired(pending.expiresAt())) {
      return ResponseEntity.status(401).body(Map.of("error", "Google login token is invalid or expired."));
    }

    return ResponseEntity.ok(pending.employee());
  }

  private Employee authenticateGoogleIdToken(String idToken, String mode) {
    if (googleClientId == null || googleClientId.isBlank()) {
      throw new IllegalArgumentException("Google sign-in is not configured on the server.");
    }

    Map<?, ?> info = fetchGoogleTokenInfo(idToken);

    String aud = valueAsString(info.get("aud"));
    if (aud == null || !aud.equals(googleClientId)) {
      throw new IllegalArgumentException("Google token audience mismatch.");
    }

    String email = valueAsString(info.get("email"));
    String emailVerified = valueAsString(info.get("email_verified"));
    if (email == null || email.isBlank()) {
      throw new IllegalArgumentException("Google account email is missing.");
    }
    if (!"true".equalsIgnoreCase(emailVerified)) {
      throw new IllegalArgumentException("Google account email is not verified.");
    }

    email = email.trim().toLowerCase();
    if (ADMIN_EMAIL.equalsIgnoreCase(email)) {
      throw new IllegalArgumentException("Admin account must use email/password login.");
    }

    String normalizedMode = normalizeMode(mode);
    var userOpt = repo.findByEmail(email);
    if (userOpt.isPresent()) {
      Employee existing = userOpt.get();
      if (existing.getRole() == null || existing.getRole().isBlank()) {
        existing.setRole("USER");
        existing = repo.save(existing);
      }
      return existing;
    }

    if ("login".equals(normalizedMode)) {
      throw new IllegalArgumentException("No account found for this Google user. Use Sign up with Google first.");
    }

    String givenName = valueAsString(info.get("given_name"));
    String familyName = valueAsString(info.get("family_name"));
    String fullName = valueAsString(info.get("name"));

    String firstName = firstNonBlank(givenName, extractFirstName(fullName), "Google");
    String lastName = firstNonBlank(familyName, extractLastName(fullName), "User");

    Employee created = new Employee();
    created.setFirstName(firstName);
    created.setLastName(lastName);
    created.setEmail(email);
    created.setRole("USER");
    created.setActive(true);
    created.setPasswordHash(null);

    return repo.save(created);
  }

  private String exchangeAuthCodeForIdToken(String code) {
    if (isGoogleOAuthCodeFlowConfigMissing()) {
      throw new IllegalArgumentException("Google sign-in is not configured on the server.");
    }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
    form.add("code", code);
    form.add("client_id", googleClientId);
    form.add("client_secret", googleClientSecret);
    form.add("redirect_uri", googleRedirectUri);
    form.add("grant_type", "authorization_code");

    Map<?, ?> tokenResponse;
    try {
      tokenResponse = restTemplate.postForObject(
          "https://oauth2.googleapis.com/token",
          new HttpEntity<>(form, headers),
          Map.class);
    } catch (RestClientException ex) {
      log.warn("Google token exchange failed", ex);
      throw new IllegalArgumentException("Could not verify Google sign-in.");
    }

    String idToken = tokenResponse != null ? valueAsString(tokenResponse.get("id_token")) : null;
    if (idToken == null || idToken.isBlank()) {
      throw new IllegalArgumentException("Google did not return an ID token.");
    }

    return idToken;
  }

  private Map<?, ?> fetchGoogleTokenInfo(String idToken) {
    String url = "https://oauth2.googleapis.com/tokeninfo?id_token="
        + URLEncoder.encode(idToken, StandardCharsets.UTF_8);

    Map<?, ?> info;
    try {
      info = restTemplate.getForObject(url, Map.class);
    } catch (RestClientException ex) {
      log.warn("Google token validation failed", ex);
      throw new IllegalArgumentException("Invalid Google token.");
    }

    if (info == null) {
      throw new IllegalArgumentException("Invalid Google token.");
    }

    return info;
  }

  private ResponseEntity<Void> redirectToFrontendWithToken(String mode, String token) {
    String location = UriComponentsBuilder.fromUriString(getFrontendUrl())
        .queryParam("google_token", token)
        .queryParam("google_mode", normalizeMode(mode))
        .build()
        .encode()
        .toUriString();
    return redirectTo(location);
  }

  private ResponseEntity<Void> redirectToFrontendWithError(String mode, String errorMessage) {
    String location = UriComponentsBuilder.fromUriString(getFrontendUrl())
        .queryParam("google_error", firstNonBlank(errorMessage, "Google sign-in failed."))
        .queryParam("google_mode", normalizeMode(mode))
        .build()
        .encode()
        .toUriString();
    return redirectTo(location);
  }

  private ResponseEntity<Void> redirectTo(String location) {
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(URI.create(location));
    return new ResponseEntity<>(headers, HttpStatus.FOUND);
  }

  private void pruneExpiredGoogleState() {
    long now = System.currentTimeMillis();
    googleStateStore.entrySet().removeIf(entry -> entry.getValue().expiresAt() <= now);
  }

  private void pruneExpiredPendingGoogleLogins() {
    long now = System.currentTimeMillis();
    pendingGoogleLogins.entrySet().removeIf(entry -> entry.getValue().expiresAt() <= now);
  }

  private static boolean isExpired(long expiresAt) {
    return System.currentTimeMillis() > expiresAt;
  }

  private boolean isGoogleOAuthCodeFlowConfigMissing() {
    return googleClientId == null || googleClientId.isBlank()
        || googleClientSecret == null || googleClientSecret.isBlank()
        || googleRedirectUri == null || googleRedirectUri.isBlank();
  }

  private String getFrontendUrl() {
    if (googleFrontendUrl == null || googleFrontendUrl.isBlank()) {
      return "http://localhost:5173";
    }
    return googleFrontendUrl;
  }

  private static String normalizeMode(String mode) {
    return "register".equalsIgnoreCase(mode) ? "register" : "login";
  }

  private static String valueAsString(Object value) {
    if (value == null)
      return null;
    String s = String.valueOf(value);
    return s;
  }

  private static String firstNonBlank(String... values) {
    if (values == null)
      return null;
    for (String v : values) {
      if (v != null && !v.trim().isBlank()) {
        return v.trim();
      }
    }
    return null;
  }

  private static String extractFirstName(String fullName) {
    if (fullName == null)
      return null;
    String trimmed = fullName.trim();
    if (trimmed.isEmpty())
      return null;
    int space = trimmed.indexOf(' ');
    return space > 0 ? trimmed.substring(0, space).trim() : trimmed;
  }

  private static String extractLastName(String fullName) {
    if (fullName == null)
      return null;
    String trimmed = fullName.trim();
    if (trimmed.isEmpty())
      return null;
    int space = trimmed.lastIndexOf(' ');
    return space > 0 ? trimmed.substring(space + 1).trim() : null;
  }
}
