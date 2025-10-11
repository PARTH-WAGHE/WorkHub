package com.queuefree.backend.controller;

import com.queuefree.backend.entity.Employee;
import com.queuefree.backend.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

  private final EmployeeRepository repo;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public AuthController(EmployeeRepository repo) {
    this.repo = repo;
  }

  public record LoginRequest(String email, String password) {}

  @PostMapping("/login")
  public ResponseEntity<Employee> login(@RequestBody LoginRequest req) {
    return repo.findByEmail(req.email())
      .filter(e -> e.getPasswordHash() != null && passwordEncoder.matches(req.password(), e.getPasswordHash()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.status(401).build());
  }
}
