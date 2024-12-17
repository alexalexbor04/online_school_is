package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('admin')") // Применяется ко всем методам
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Получение списка пользователей
    @GetMapping("/users")
    public ResponseEntity<List<Users>> listUsers(@Param("keyword") String keyword) {
        List<Users> users;
        if (keyword != null) {
            users = userRepository.searchUsers(keyword);
        } else {
            users = userRepository.findAll();
        }
        return ResponseEntity.ok(users);
    }

    // Изменение роли пользователя
    @PutMapping("/users/{id}/changeRole")
    public ResponseEntity<String> changeRole(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String roleName = body.get("role");
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
}
