package com.example.online_school_is.entity;


import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;

@Entity
@Table(name = "roles")
public class Roles implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = 3L;
    private String name;

    @ManyToMany(mappedBy = "roles")
    private Set<Users> users;

    //-------конструкторы------
    public Roles() {}

    public Roles(String name) {
        this.name = name;
    }

    public Roles(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    //-----getters & setters----
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    @Override
    public String getAuthority() {
        return name;
    }
}
