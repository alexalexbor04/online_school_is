package com.example.online_school_is.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AboutController {

    @GetMapping("/about")
    public ResponseEntity<Void> aboutPage() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
