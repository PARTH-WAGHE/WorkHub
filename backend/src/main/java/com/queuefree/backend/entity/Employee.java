package com.queuefree.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

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

  private String phone;

  private String department;

  private String position;

  private String address;

  private BigDecimal salary;

  private LocalDate dateOfBirth;

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

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getDepartment() { return department; }
  public void setDepartment(String department) { this.department = department; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public LocalDate getDateOfBirth() { return dateOfBirth; }
  public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

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
