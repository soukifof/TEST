package com.evotemali.controller;

import com.evotemali.model.Electeur;
import com.evotemali.repository.ElecteurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/electeurs")
@CrossOrigin(origins = "http://localhost:4200")
public class ElecteurController {

    private final ElecteurRepository electeurRepository;

    public ElecteurController(ElecteurRepository electeurRepository) {
        this.electeurRepository = electeurRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerElecteur(@RequestBody Electeur electeur) {
        // Validation minimale
        if (electeur.getTelephone() == null || electeur.getLangue() == null) {
            return ResponseEntity.badRequest().body("Téléphone ou langue manquant");
        }

        // Génération OTP sécurisé
        String otp = generateOtp();
        electeur.setOtp(otp);
        electeur.setOtpExpiration(LocalDateTime.now().plusMinutes(5)); // Expiration dans 5 min

        // Message multilingue
        String message = switch (electeur.getLangue().toLowerCase()) {
            case "fr" -> "Votre code de vérification est : " + otp;
            case "bm" -> "I ka sigi kɔdɔ ye : " + otp;
            default -> "Your verification code is: " + otp;
        };

        // Sauvegarde + log
        electeurRepository.save(electeur);
        System.out.println("✅ Électeur enregistré : " + electeur.getTelephone());

        return ResponseEntity.ok(message);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        return String.valueOf(100000 + random.nextInt(900000));
    }
}
