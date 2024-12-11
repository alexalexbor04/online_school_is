package com.example.online_school_is.controller;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Регистрация нового пользователя
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Имя пользователя уже существует");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Roles userRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Роль STUDENT не найдена"));
        user.setRoles(userRole);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("Регистрация прошла успешно!");
    }

    @GetMapping("/register")
    public ResponseEntity<Void> registerPage() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Users user) {
        Users existingUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неправильное имя пользователя или пароль");
        }
        return ResponseEntity.ok("Вход выполнен успешно!");
    }

    @GetMapping("/login")
    public ResponseEntity<Void> loginPage() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}