package com.example.online_school_is.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class Users implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    private Roles role;

    @Column(name = "full_name", nullable = false)
    private String full_name;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    /* dependences*/

    @OneToMany(mappedBy = "teacher_id")
    private Set<Courses> courses;

    @OneToMany(mappedBy = "student_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Attendance> attendance;

    @OneToMany(mappedBy = "student_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Grades> grades;

    public Users() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public void setUsername(String username) { this.username = username; }

    public void setPassword(String password) { this.password = password; }

    public String getFull_name() { return full_name; }

    public void setFull_name(String full_name) { this.full_name = full_name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public Roles getRoles() { return role; }

    public void setRoles(Roles role) { this.role = role; }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Проверяем, есть ли роль, и возвращаем список с одной ролью
        return role != null ?
                List.of(new SimpleGrantedAuthority(role.getName())) :
                List.of();
    }


}

