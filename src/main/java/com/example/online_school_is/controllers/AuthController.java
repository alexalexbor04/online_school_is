package com.example.online_school_is.controller;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

//import javax.validation.Valid;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
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
        // Проверяем, существует ли пользователь с таким именем
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Имя пользователя уже существует");
        }

        // Шифрование пароля
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Назначение роли "USER" по умолчанию
        Roles userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Роль USER не найдена"));

        Set<Roles> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        // Сохранение пользователя в базе данных
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("Регистрация прошла успешно!");
    }

    // Аутентификация пользователя (заглушка, если JWT или другие механизмы не используются)
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Users user) {
        // Проверка наличия пользователя
        Users existingUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Проверка пароля
        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неправильное имя пользователя или пароль");
        }

        // Успешная аутентификация
        return ResponseEntity.ok("Вход выполнен успешно!");
    }
}

