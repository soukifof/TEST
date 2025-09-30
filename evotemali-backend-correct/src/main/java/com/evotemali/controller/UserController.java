package com.evotemali.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/api/users/hello")
    public String hello() {
        return "👋 Bonjour depuis le backend E-Vote Mali !";
    }
}
