package com.queuefree.repository;

import com.queuefree.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Page<Employee> findByDepartment(String department, Pageable pageable);
    
    Page<Employee> findByStatus(String status, Pageable pageable);
    
    @Query("SELECT e FROM Employee e WHERE " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Employee> findByFilters(
            @Param("department") String department,
            @Param("status") String status,
            @Param("search") String search,
            Pageable pageable);
    
    @Query("SELECT e FROM Employee e ORDER BY e.createdAt DESC")
    List<Employee> findRecentEmployees(Pageable pageable);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :department")
    long countByDepartment(@Param("department") String department);
}
