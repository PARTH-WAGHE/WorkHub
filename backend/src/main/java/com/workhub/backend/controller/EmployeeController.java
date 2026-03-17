package com.workhub.backend.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workhub.backend.entity.Employee;
import com.workhub.backend.repository.EmployeeRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*") // allow deployed frontend
public class EmployeeController {

  private static final Logger log = LoggerFactory.getLogger(EmployeeController.class);

  private final EmployeeRepository repo;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public EmployeeController(EmployeeRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public List<Employee> list() {
    return repo.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Employee> get(@PathVariable Long id) {
    return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody Employee employee) {
    try {
      // Frontend sends plain password in transient `password`; store only hashed
      // value.
      if (employee.getPassword() != null && !employee.getPassword().isBlank()) {
        employee.setPasswordHash(passwordEncoder.encode(employee.getPassword()));
      } else if (employee.getPasswordHash() != null && !employee.getPasswordHash().isBlank()) {
        // Backward-compatible fallback for legacy payloads.
        employee.setPasswordHash(passwordEncoder.encode(employee.getPasswordHash()));
      }

      // Set default role if not provided
      if (employee.getRole() == null || employee.getRole().isEmpty()) {
        employee.setRole("USER");
      }

      Employee saved = repo.save(employee);
      return ResponseEntity.ok(saved);
    } catch (DataIntegrityViolationException ex) {
      log.error("Data integrity violation when creating employee", ex);
      if (ex.getMessage().contains("Duplicate entry") && ex.getMessage().contains("email")) {
        return ResponseEntity.status(409).body(Map.of("error",
            "An account with this email already exists. Please use a different email or try logging in."));
      }
      return ResponseEntity.status(400).body(Map.of("error", "Invalid data provided. Please check your input."));
    } catch (Exception ex) {
      log.error("Unexpected error when creating employee", ex);
      return ResponseEntity.status(500).body(Map.of("error", "Internal server error. Please try again later."));
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Employee> update(@PathVariable Long id, @Valid @RequestBody Employee e) {
    return repo.findById(id)
        .map(found -> {
          e.setId(found.getId());
          if (e.getPassword() != null && !e.getPassword().isBlank()) {
            e.setPasswordHash(passwordEncoder.encode(e.getPassword()));
          } else {
            e.setPasswordHash(found.getPasswordHash());
          }
          if (e.getRole() == null || e.getRole().isEmpty()) {
            e.setRole(found.getRole());
          }
          return ResponseEntity.ok(repo.save(e));
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    return repo.findById(id)
        .map(found -> {
          repo.delete(found);
          return ResponseEntity.noContent().<Void>build();
        })
        .orElse(ResponseEntity.notFound().build());
  }
}
