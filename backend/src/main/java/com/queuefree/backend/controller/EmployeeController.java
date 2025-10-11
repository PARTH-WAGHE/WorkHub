package com.queuefree.backend.controller;

import com.queuefree.backend.entity.Employee;
import com.queuefree.backend.repository.EmployeeRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

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
  public ResponseEntity<Employee> create(@Valid @RequestBody Employee e) {
    e.setId(null);
    if (e.getPassword() == null || e.getPassword().isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    e.setPasswordHash(passwordEncoder.encode(e.getPassword()));
    return ResponseEntity.ok(repo.save(e));
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
        return ResponseEntity.ok(repo.save(e));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> delete(@PathVariable Long id) {
    return repo.findById(id)
      .map(found -> { repo.delete(found); return ResponseEntity.noContent().build(); })
      .orElse(ResponseEntity.notFound().build());
  }
}
