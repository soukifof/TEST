package com.evotemali.service;

import com.evotemali.model.Utilisateur;
import com.evotemali.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    @Autowired
    private UtilisateurService utilisateurService;
    
    // ✅ INSCRIPTION - CORRIGÉE
    public Map<String, Object> register(Utilisateur utilisateur) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Vérifier si l'email existe
            if (utilisateurService.existeParEmail(utilisateur.getEmail())) {
                response.put("success", false);
                response.put("message", "Un utilisateur avec cet email existe déjà");
                return response;
            }
            
            // ✅ SAUVEGARDE DIRECTE
            Utilisateur savedUser = utilisateurRepository.save(utilisateur);
            
            response.put("success", true);
            response.put("message", "Inscription réussie");
            response.put("data", savedUser);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur lors de l'inscription: " + e.getMessage());
        }
        
        return response;
    }
    
    // ✅ CONNEXION - CORRIGÉE
    public Map<String, Object> login(String email, String motDePasse) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Utilisateur> userOpt = utilisateurService.trouverParEmail(email);
            
            if (userOpt.isPresent() && userOpt.get().getMotDePasse().equals(motDePasse)) {
                response.put("success", true);
                response.put("message", "Connexion réussie");
                response.put("data", userOpt.get());
            } else {
                response.put("success", false);
                response.put("message", "Email ou mot de passe incorrect");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur de connexion: " + e.getMessage());
        }
        
        return response;
    }
}