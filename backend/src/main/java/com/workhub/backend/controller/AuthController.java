package com.workhub.backend.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workhub.backend.entity.Employee;
import com.workhub.backend.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allow deployed frontend
public class AuthController {

  private static final Logger log = LoggerFactory.getLogger(AuthController.class);

  private final EmployeeRepository repo;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  // Hardcoded admin credentials
  private static final String ADMIN_EMAIL = "admin@workhub.com";
  private static final String ADMIN_PASSWORD = "admin";

  public AuthController(EmployeeRepository repo) {
    this.repo = repo;
  }

  public record LoginRequest(String email, String password) {
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
}
