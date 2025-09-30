package com.evotemali.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*") // autorise les requêtes Angular
public class HomeController {

    @GetMapping("/welcome")
    public String getWelcomeMessage(@RequestParam(defaultValue = "Cher citoyen") String name) {
        return "Bienvenue sur E-Vote Mali, " + name + " !";
    }
}
