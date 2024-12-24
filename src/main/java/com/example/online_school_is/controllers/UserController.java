package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/admin/users")
    public ResponseEntity<List<Users>> listUsers() {
        List<Users> users;
        users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/admin/users/{id}/changeRole")
    public ResponseEntity<String> changeRole(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String roleName = body.get("role");
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Неправильный id"));

        Roles role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Неверная роль"));
        user.setRoles(role);
        userRepository.save(user);

        return ResponseEntity.ok("Роль пользователя изменена");
    }
    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));

        userRepository.delete(user);

        return ResponseEntity.ok("Пользователь с ID " + id + " удалён");
    }

    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    @GetMapping("/students")
    public ResponseEntity<List<Users>> getAllStudents() {
        List<Users> students = userRepository.findByRoleName("student");
        return ResponseEntity.ok(students);
    }
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    @GetMapping("/teachers")
    public ResponseEntity<List<Users>> getAllTeachers() {
        List<Users> students = userRepository.findByRoleName("teacher");
        return ResponseEntity.ok(students);
    }

}
