package com.queuefree.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;
    
    public Role(ERole name) {
        this.name = name;
    }
    
    public enum ERole {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_MODERATOR
    }
}
