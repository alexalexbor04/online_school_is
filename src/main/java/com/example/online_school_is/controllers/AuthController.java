package com.example.online_school_is.controller;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Имя пользователя уже существует"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Roles userRole = roleRepository.findByName("student")
                .orElseThrow(() -> new RuntimeException("Роль student не найдена"));
        user.setRoles(userRole);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Регистрация прошла успешно!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Users user) {
        Users existingUser = userRepository.findByUsername(user.getUsername())
                .orElse(null);

        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Пользователь не найден"));
        }

        if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            String token = Jwts.builder()
                    .setSubject(existingUser.getUsername())
                    .claim("roles", existingUser.getRoles())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 час
                    .signWith(SignatureAlgorithm.HS512, "secretKeySecretKey12345678secretKeySecretKey12345678" +
                            "secretKeySecretKey12345678secretKeySecretKey12345678secretKeySecretKey12345678")
                    .compact();

            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Неверный пароль"));
        }
    }

    @GetMapping("/login")
    public ResponseEntity<Void> loginPage() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
