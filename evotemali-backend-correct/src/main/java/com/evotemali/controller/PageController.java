package com.evotemali.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/hello")
    public String helloPage() {
        return "hello"; // correspond au fichier hello.html
    }
}
