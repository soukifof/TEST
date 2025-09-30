package com.evotemali.sms;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpStore {

    // Map pour stocker les OTP avec leur timestamp
    private final Map<String, OtpEntry> otpMap = new ConcurrentHashMap<>();

    /**
     * Sauvegarde un OTP avec l'heure actuelle.
     */
    public void saveOtp(String phoneNumber, String otp) {
        otpMap.put(phoneNumber, new OtpEntry(otp, Instant.now()));
    }

    /**
     * Vérifie si l'OTP est valide et non expiré.
     */
    public boolean verifyOtp(String phoneNumber, String otp) {
        OtpEntry entry = otpMap.get(phoneNumber);
        if (entry == null) return false;

        // Vérifie si l'OTP est expiré (plus de 2 minutes)
        if (Duration.between(entry.timestamp(), Instant.now()).toMinutes() > 2) {
            otpMap.remove(phoneNumber); // Nettoyage
            return false;
        }

        return entry.otp().equals(otp);
    }

    /**
     * Structure interne pour stocker l'OTP et son timestamp.
     */
    private record OtpEntry(String otp, Instant timestamp) {}
}
