package com.evotemali.sms;

import org.springframework.stereotype.Component;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class SmsClient {

    private final RestTemplate restTemplate;

    // Tu peux injecter le token via application.properties ou autre méthode sécurisée
    private static final String API_URL = "https://api.orange.com/sms/send";
    private static final String API_TOKEN = "VOTRE_TOKEN_API"; // Remplace par une variable externe si possible

    public SmsClient() {
        this.restTemplate = new RestTemplate();
    }

    public void sendSms(String to, String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(API_TOKEN); // méthode plus propre pour Bearer token
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("to", to);
        body.put("message", message);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, request, String.class);
            System.out.println("SMS envoyé. Réponse : " + response.getBody());
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi du SMS : " + e.getMessage());
        }
    }
}
