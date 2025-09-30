package com.evotemali.sms;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@RequestBody SmsRequest request) {
        smsService.sendOtp(request.getTo());
        return ResponseEntity.ok("OTP envoyé");
    }
}
