package com.queuefree.controller;

import com.queuefree.model.Employee;
import com.queuefree.payload.response.MessageResponse;
import com.queuefree.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        
        try {
            String sortField = sort[0];
            String sortDirection = sort.length > 1 ? sort[1] : "asc";
            
            Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
            
            Page<Employee> employeePage;
            
            if (search != null || department != null || status != null) {
                employeePage = employeeService.findByFilters(department, status, search, pageable);
            } else {
                employeePage = employeeService.findAll(pageable);
            }
            
            List<Employee> employees = employeePage.getContent();
            
            Map<String, Object> response = new HashMap<>();
            response.put("employees", employees);
            response.put("currentPage", employeePage.getNumber());
            response.put("totalItems", employeePage.getTotalElements());
            response.put("totalPages", employeePage.getTotalPages());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        return employeeService.findById(id)
                .map(employee -> new ResponseEntity<>(employee, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(
                        new MessageResponse("Employee not found with id: " + id),
                        HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEmployee(@Valid @RequestBody Employee employee) {
        if (employeeService.existsByEmail(employee.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        Employee createdEmployee = employeeService.save(employee);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employeeDetails) {
        return employeeService.findById(id)
                .map(existingEmployee -> {
                    // Check if email is being changed and already exists
                    if (!existingEmployee.getEmail().equals(employeeDetails.getEmail()) && 
                        employeeService.existsByEmail(employeeDetails.getEmail())) {
                        return ResponseEntity
                                .badRequest()
                                .body(new MessageResponse("Error: Email is already in use!"));
                    }
                    
                    // Update employee details
                    existingEmployee.setFirstName(employeeDetails.getFirstName());
                    existingEmployee.setLastName(employeeDetails.getLastName());
                    existingEmployee.setEmail(employeeDetails.getEmail());
                    existingEmployee.setDepartment(employeeDetails.getDepartment());
                    existingEmployee.setPosition(employeeDetails.getPosition());
                    existingEmployee.setJoiningDate(employeeDetails.getJoiningDate());
                    existingEmployee.setStatus(employeeDetails.getStatus());
                    existingEmployee.setPhoneNumber(employeeDetails.getPhoneNumber());
                    existingEmployee.setAddress(employeeDetails.getAddress());
                    
                    Employee updatedEmployee = employeeService.save(existingEmployee);
                    return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(
                        new MessageResponse("Employee not found with id: " + id),
                        HttpStatus.NOT_FOUND));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        return employeeService.findById(id)
                .map(employee -> {
                    employeeService.deleteById(id);
                    return new ResponseEntity<>(new MessageResponse("Employee deleted successfully"), HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(
                        new MessageResponse("Employee not found with id: " + id),
                        HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Employee>> getRecentEmployees(@RequestParam(defaultValue = "5") int limit) {
        List<Employee> recentEmployees = employeeService.findRecentEmployees(limit);
        return new ResponseEntity<>(recentEmployees, HttpStatus.OK);
    }
}
