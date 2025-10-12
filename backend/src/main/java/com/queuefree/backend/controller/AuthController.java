package com.queuefree.backend.controller;

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

import com.queuefree.backend.entity.Employee;
import com.queuefree.backend.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allow deployed frontend
public class AuthController {

  private static final Logger log = LoggerFactory.getLogger(AuthController.class);

  private final EmployeeRepository repo;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  // Hardcoded admin credentials
  private static final String ADMIN_EMAIL = "admin@workhub.com";
  private static final String ADMIN_PASSWORD = "admin1234";

  public AuthController(EmployeeRepository repo) {
    this.repo = repo;
  }

  public record LoginRequest(String email, String password) {}

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    try {
      // Check for hardcoded admin first
      if (ADMIN_EMAIL.equals(req.email()) && ADMIN_PASSWORD.equals(req.password())) {
        Employee admin = new Employee();
        admin.setId(0L);
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail(ADMIN_EMAIL);
        admin.setRole("ADMIN");
        admin.setActive(true);
        return ResponseEntity.ok(admin);
      }
      if (ADMIN_EMAIL.equals(req.email())) {
        return ResponseEntity.status(401).body(Map.of("error", "Oops! Invalid admin credentials. Please try again."));
      }

      var userOpt = repo.findByEmail(req.email());
      if (userOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("error", "We couldn't find your account. Ready to join us?"));
      }

      Employee employee = userOpt.get();
      if (employee.getPasswordHash() == null || !passwordEncoder.matches(req.password(), employee.getPasswordHash())) {
        return ResponseEntity.status(404).body(Map.of("error", "Hmm... we couldn't find your account. Let's get you registered!"));
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
