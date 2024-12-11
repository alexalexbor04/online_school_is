package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('admin')") // Применяется ко всем методам
public class AdmController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Получение списка пользователей
    @GetMapping("/users")
    public ResponseEntity<List<Users>> listUsers() {
        List<Users> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Получение пользователя по ID
    @GetMapping("/users/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable("id") Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));
        return ResponseEntity.ok(user);
    }

    // Изменение роли пользователя
    @PutMapping("/users/{id}/changeRole")
    public ResponseEntity<String> changeRole(@PathVariable("id") Long id, @RequestParam("role_name") String roleName) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));

        Roles role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Роль с названием " + roleName + " не найдена"));
        user.setRoles(role);
        userRepository.save(user);

        return ResponseEntity.ok("Роль пользователя успешно изменена");
    }

    // Удаление пользователя
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с ID " + id + " не найден"));

        userRepository.delete(user);

        return ResponseEntity.ok("Пользователь с ID " + id + " успешно удалён");
    }

    // Создание нового пользователя (администратор может добавить нового пользователя)
    @PostMapping("/users")
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        if (user.getRoles() == null) {
            // Если роли не указаны, по умолчанию назначаем роль STUDENT
            Roles userRole = roleRepository.findByName("student")
                    .orElseThrow(() -> new IllegalArgumentException("Роль student не найдена"));
            user.setRoles(userRole);
        }

        Users createdUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
}
