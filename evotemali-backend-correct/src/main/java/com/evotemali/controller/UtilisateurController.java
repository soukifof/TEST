package com.evotemali.controller;

import com.evotemali.model.Utilisateur;
import com.evotemali.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateur")
@CrossOrigin(origins = "http://localhost:4200")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    /**
     * ✅ ENDPOINT POUR METTRE À JOUR LE PROFIL UTILISATEUR
     */
    @PutMapping("/profil")
    public ResponseEntity<Map<String, Object>> updateProfil(@RequestBody Map<String, Object> profilData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🔄 MISE À JOUR DU PROFIL...");
            System.out.println("📦 Données reçues: " + profilData);
            
            // Vérifier l'ID utilisateur
            if (profilData.get("id") == null) {
                response.put("success", false);
                response.put("message", "ID utilisateur manquant");
                return ResponseEntity.badRequest().body(response);
            }
            
            Long userId = Long.valueOf(profilData.get("id").toString());
            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findById(userId);
            
            if (!utilisateurOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            Utilisateur utilisateur = utilisateurOpt.get();
            
            // ✅ Mettre à jour les champs du profil
            if (profilData.get("photoProfil") != null) {
                utilisateur.setPhotoProfil(profilData.get("photoProfil").toString());
                System.out.println("🖼️ Photo de profil mise à jour");
            }
            
            if (profilData.get("numeroNina") != null) {
                utilisateur.setNumeroNina(profilData.get("numeroNina").toString());
                System.out.println("🔢 Numéro NINA mis à jour: " + profilData.get("numeroNina"));
            }
            
            // Mettre à jour la date de modification
            utilisateur.setDateModification(new Date());
            
            // Sauvegarder
            Utilisateur utilisateurMisAJour = utilisateurRepository.save(utilisateur);
            
            // Préparer la réponse
            Map<String, Object> userResponse = new LinkedHashMap<>();
            userResponse.put("id", utilisateurMisAJour.getId());
            userResponse.put("nom", utilisateurMisAJour.getNom());
            userResponse.put("prenom", utilisateurMisAJour.getPrenom());
            userResponse.put("email", utilisateurMisAJour.getEmail());
            userResponse.put("telephone", utilisateurMisAJour.getTelephone());
            userResponse.put("dateNaissance", utilisateurMisAJour.getDateNaissance());
            userResponse.put("numeroNina", utilisateurMisAJour.getNumeroNina());
            userResponse.put("photoProfil", utilisateurMisAJour.getPhotoProfil());
            userResponse.put("dateCreation", utilisateurMisAJour.getDateCreation());
            userResponse.put("dateModification", utilisateurMisAJour.getDateModification());
            
            response.put("success", true);
            response.put("message", "Profil mis à jour avec succès");
            response.put("data", userResponse);
            
            System.out.println("✅ PROFIL MIS À JOUR AVEC SUCCÈS pour l'utilisateur: " + utilisateurMisAJour.getPrenom() + " " + utilisateurMisAJour.getNom());
            System.out.println("📸 Photo profil: " + (utilisateurMisAJour.getPhotoProfil() != null ? "Oui" : "Non"));
            System.out.println("🔢 NINA: " + utilisateurMisAJour.getNumeroNina());
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR MISE À JOUR PROFIL: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Erreur lors de la mise à jour: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ ENDPOINT POUR RÉCUPÉRER UN UTILISATEUR PAR ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUtilisateurById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findById(id);
            
            if (!utilisateurOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            Utilisateur utilisateur = utilisateurOpt.get();
            
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("id", utilisateur.getId());
            userMap.put("nom", utilisateur.getNom());
            userMap.put("prenom", utilisateur.getPrenom());
            userMap.put("email", utilisateur.getEmail());
            userMap.put("telephone", utilisateur.getTelephone());
            userMap.put("dateNaissance", utilisateur.getDateNaissance());
            userMap.put("numeroNina", utilisateur.getNumeroNina());
            userMap.put("photoProfil", utilisateur.getPhotoProfil());
            userMap.put("dateCreation", utilisateur.getDateCreation());
            userMap.put("dateModification", utilisateur.getDateModification());
            
            response.put("success", true);
            response.put("data", userMap);
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR RÉCUPÉRATION UTILISATEUR: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Erreur: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}