package com.example.online_school_is.entity;


import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Roles implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String role_name;

    @ManyToMany(mappedBy = "roles")
    private Set<Users> users;

    //-------конструкторы------
    public Roles() {}

    public Roles(String role_name) {
        this.role_name = role_name;
    }

    public Roles(Long id, String role_name) {
        this.id = id;
        this.role_name = role_name;
    }

    //-----getters & setters----
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getRole_name() { return role_name; }

    public void setRole_name(String role_name) { this.role_name = role_name; }

    @Override
    public String getAuthority() {
        return role_name;
    }
}
