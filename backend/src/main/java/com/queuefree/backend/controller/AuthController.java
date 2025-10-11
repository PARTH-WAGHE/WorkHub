package com.queuefree.backend.controller;

import java.util.Map;

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
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

  private final EmployeeRepository repo;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  // Hardcoded admin credentials
  private static final String ADMIN_EMAIL = "admin@queuefree.com";
  private static final String ADMIN_PASSWORD = "admin123";

  public AuthController(EmployeeRepository repo) {
    this.repo = repo;
  }

  public record LoginRequest(String email, String password) {}

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
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

    // Check if admin email with wrong password
    if (ADMIN_EMAIL.equals(req.email())) {
      return ResponseEntity.status(401).body(Map.of("error", "Oops! Invalid admin credentials. Please try again."));
    }

    // Check if user exists
    var userOpt = repo.findByEmail(req.email());
    if (userOpt.isEmpty()) {
      return ResponseEntity.status(404).body(Map.of("error", "We couldn't find your account. Ready to join us?"));
    }

    // Check password - but return "not registered" message for security
    Employee employee = userOpt.get();
    if (employee.getPasswordHash() == null || !passwordEncoder.matches(req.password(), employee.getPasswordHash())) {
      return ResponseEntity.status(404).body(Map.of("error", "Hmm... we couldn't find your account. Let's get you registered!"));
    }

    // Set default role if not set
    if (employee.getRole() == null || employee.getRole().isEmpty()) {
      employee.setRole("USER");
    }

    return ResponseEntity.ok(employee);
  }
}
