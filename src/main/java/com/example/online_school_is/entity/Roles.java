package com.example.online_school_is.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;

@Entity
@Table(name = "roles")
public class Roles implements GrantedAuthority {
    @Id
    private Long id;
    private String role_name;

    //-------конструкторы------
    public Roles() {}

    public Roles(Long id) {
        this.id = id;
    }

    public Roles(String role_name) {
        this.role_name = role_name;
    }

    //-----getters & setters----
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getRole_name() { return role_name; }

    public void setRole_name(String role_name) { this.role_name = role_name; }

    @Override
    public String getAuthority() {
        return getRole_name();
    }
}
