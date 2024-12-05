package com.example.online_school_is.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class redirectController {

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/auth/login";
    }
}
