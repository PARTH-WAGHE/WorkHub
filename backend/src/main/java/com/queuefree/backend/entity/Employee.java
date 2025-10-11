package com.queuefree.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false)
  private String firstName;

  @NotBlank
  @Column(nullable = false)
  private String lastName;

  @Email
  @NotBlank
  @Column(nullable = false, unique = true)
  private String email;

  private String position;

  private BigDecimal salary;

  private LocalDate hireDate;

  @Column(nullable = false)
  private boolean active = true;

  @Transient
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @JsonIgnore
  @Column(name = "password_hash")
  private String passwordHash;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPosition() { return position; }
  public void setPosition(String position) { this.position = position; }

  public BigDecimal getSalary() { return salary; }
  public void setSalary(BigDecimal salary) { this.salary = salary; }

  public LocalDate getHireDate() { return hireDate; }
  public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
