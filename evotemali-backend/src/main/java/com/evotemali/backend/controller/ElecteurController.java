package com.evotemali.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/electeurs")
public class ElecteurController {

    @GetMapping
    public List<String> getAllElecteurs() {
        return List.of("Souki", "Fatou", "Mariam");
    }
}
