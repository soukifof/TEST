package com.evotemali.service;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class LoginService {

    public String genererOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // OTP à 6 chiffres
        return String.valueOf(otp);
    }
}
