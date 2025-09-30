package com.evotemali.sms;

import java.security.SecureRandom;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    private final SmsClient smsClient;
    private final OtpStore otpStore;
    private final SecureRandom secureRandom = new SecureRandom(); // ✅ Instance sécurisée

    public SmsService(SmsClient smsClient, OtpStore otpStore) {
        this.smsClient = smsClient;
        this.otpStore = otpStore;
    }

    public void sendOtp(String phoneNumber) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000)); // ✅ Utilisation cohérente
        otpStore.saveOtp(phoneNumber, otp);

        String message = "Votre code OTP pour voter est : " + otp;
        smsClient.sendSms(phoneNumber, message);
    }
}
