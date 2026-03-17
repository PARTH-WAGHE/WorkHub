package com.workhub.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workhub.backend.entity.Employee;
import com.workhub.backend.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

  private final EmployeeRepository repo;

  public AdminController(EmployeeRepository repo) {
    this.repo = repo;
  }

  // Admin can list all employees
  @GetMapping
  public List<Employee> listAll() {
    return repo.findAll();
  }

  // Admin can view any employee
  @GetMapping("/{id}")
  public ResponseEntity<Employee> get(@PathVariable Long id) {
    return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  // Admin can delete any employee
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
