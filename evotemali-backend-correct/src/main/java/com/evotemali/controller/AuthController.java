package com.evotemali.controller;

import com.evotemali.model.Utilisateur;
import com.evotemali.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    /**
     * ✅ INSCRIPTION
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = userData.get("email");
            String motDePasse = userData.get("motDePasse");
            
            // Vérifier si l'email existe déjà
            if (utilisateurRepository.existsByEmail(email)) {
                response.put("success", false);
                response.put("message", "Cet email est déjà utilisé");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Créer un nouvel utilisateur
            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setNom(userData.get("nom"));
            utilisateur.setPrenom(userData.get("prenom"));
            utilisateur.setEmail(email);
            utilisateur.setTelephone(userData.get("telephone"));
            utilisateur.setMotDePasse(motDePasse);
            utilisateur.setDateNaissance(userData.get("dateNaissance"));
            
            Utilisateur savedUser = utilisateurRepository.save(utilisateur);
            
            // Préparer la réponse sans le mot de passe
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", savedUser.getId());
            userResponse.put("nom", savedUser.getNom());
            userResponse.put("prenom", savedUser.getPrenom());
            userResponse.put("email", savedUser.getEmail());
            userResponse.put("telephone", savedUser.getTelephone());
            userResponse.put("dateNaissance", savedUser.getDateNaissance());
            userResponse.put("numeroNina", savedUser.getNumeroNina());
            userResponse.put("photoProfil", savedUser.getPhotoProfil());
            userResponse.put("dateCreation", savedUser.getDateCreation());
            
            response.put("success", true);
            response.put("message", "Inscription réussie");
            response.put("user", userResponse); // ✅ IMPORTANT: "user" et non "data"
            
            System.out.println("✅ NOUVEL UTILISATEUR INSCRIT: " + savedUser.getEmail() + " ID: " + savedUser.getId());
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR INSCRIPTION: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Erreur lors de l'inscription: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ CONNEXION
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = loginData.get("email");
            String motDePasse = loginData.get("motDePasse");
            
            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);
            
            if (utilisateurOpt.isPresent()) {
                Utilisateur utilisateur = utilisateurOpt.get();
                
                // Vérifier le mot de passe
                if (utilisateur.getMotDePasse().equals(motDePasse)) {
                    
                    // Préparer la réponse sans le mot de passe
                    Map<String, Object> userResponse = new HashMap<>();
                    userResponse.put("id", utilisateur.getId());
                    userResponse.put("nom", utilisateur.getNom());
                    userResponse.put("prenom", utilisateur.getPrenom());
                    userResponse.put("email", utilisateur.getEmail());
                    userResponse.put("telephone", utilisateur.getTelephone());
                    userResponse.put("dateNaissance", utilisateur.getDateNaissance());
                    userResponse.put("numeroNina", utilisateur.getNumeroNina());
                    userResponse.put("photoProfil", utilisateur.getPhotoProfil());
                    userResponse.put("dateCreation", utilisateur.getDateCreation());
                    
                    response.put("success", true);
                    response.put("message", "Connexion réussie");
                    response.put("user", userResponse);
                    
                } else {
                    response.put("success", false);
                    response.put("message", "Mot de passe incorrect");
                }
            } else {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur lors de la connexion: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}