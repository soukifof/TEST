package com.evotemali.controller;

import com.evotemali.dto.LoginDTO;
import com.evotemali.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginRestController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public String recevoirInfos(@RequestBody LoginDTO infos) {
        String otp = loginService.genererOTP();
        System.out.println("🔐 OTP généré : " + otp);
        return "OTP envoyé au numéro " + infos.getTelephone();
    }
}
