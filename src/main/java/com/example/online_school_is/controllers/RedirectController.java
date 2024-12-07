package com.example.online_school_is.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedirectController {

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/auth/login";
    }
}
