package com.evotemali.controller;

import com.evotemali.model.Candidat;
import com.evotemali.model.Utilisateur;
import com.evotemali.model.Vote;
import com.evotemali.repository.CandidatRepository;
import com.evotemali.repository.UtilisateurRepository;
import com.evotemali.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/vote")
@CrossOrigin(origins = "http://localhost:4200")
public class VoteController {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private CandidatRepository candidatRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    /**
     * ✅ ENDPOINT POUR ENREGISTRER UN VOTE AVEC LES INFORMATIONS UTILISATEUR
     */
    @PostMapping("/voter")
    public ResponseEntity<Map<String, Object>> enregistrerVote(@RequestBody Map<String, Object> voteData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🗳️ ENREGISTREMENT D'UN VOTE...");
            System.out.println("📦 Données reçues: " + voteData);
            
            // Vérifier les données obligatoires
            Long userId = voteData.get("userId") != null ? Long.valueOf(voteData.get("userId").toString()) : null;
            Long candidatId = voteData.get("candidatId") != null ? Long.valueOf(voteData.get("candidatId").toString()) : null;
            
            if (userId == null || candidatId == null) {
                response.put("success", false);
                response.put("message", "ID utilisateur et ID candidat sont obligatoires");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Vérifier si l'utilisateur existe
            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findById(userId);
            if (!utilisateurOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Vérifier si le candidat existe
            Optional<Candidat> candidatOpt = candidatRepository.findById(candidatId);
            if (!candidatOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Candidat non trouvé");
                return ResponseEntity.badRequest().body(response);
            }
            
            Utilisateur utilisateur = utilisateurOpt.get();
            Candidat candidat = candidatOpt.get();
            
            // Vérifier si l'utilisateur a déjà voté
            boolean aDejaVote = voteRepository.existsByUtilisateurId(userId);
            if (aDejaVote) {
                response.put("success", false);
                response.put("message", "Vous avez déjà voté");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Générer une référence de vote unique
            String referenceVote = "VOTE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            
            // Créer le vote avec les informations de l'utilisateur
            Vote vote = new Vote();
            vote.setNom(utilisateur.getNom());
            vote.setPrenom(utilisateur.getPrenom());
            vote.setEmail(utilisateur.getEmail());
            vote.setTelephone(utilisateur.getTelephone());
            vote.setNumeroElecteur(utilisateur.getNumeroNina()); // Utiliser le NINA comme numéro d'électeur
            vote.setReferenceVote(referenceVote);
            vote.setDateVote(new Date());
            vote.setEstValide(true);
            vote.setCandidat(candidat);
            vote.setUtilisateur(utilisateur); // Lier le vote à l'utilisateur
            
            // Générer et sauvegarder un code OTP (optionnel)
            String codeOtp = genererCodeOTP();
            vote.setCodeOtp(codeOtp);
            vote.setOtpVerifie(true); // Ou false si vous voulez vérifier par OTP
            
            // Sauvegarder le vote
            Vote voteSauvegarde = voteRepository.save(vote);
            
            // Préparer la réponse
            Map<String, Object> voteResponse = new HashMap<>();
            voteResponse.put("id", voteSauvegarde.getId());
            voteResponse.put("referenceVote", voteSauvegarde.getReferenceVote());
            voteResponse.put("nom", voteSauvegarde.getNom());
            voteResponse.put("prenom", voteSauvegarde.getPrenom());
            voteResponse.put("candidat", candidat.getNom());
            voteResponse.put("dateVote", voteSauvegarde.getDateVote());
            voteResponse.put("codeOtp", voteSauvegarde.getCodeOtp());
            
            response.put("success", true);
            response.put("message", "Vote enregistré avec succès");
            response.put("data", voteResponse);
            
            System.out.println("✅ VOTE ENREGISTRÉ AVEC SUCCÈS");
            System.out.println("👤 Utilisateur: " + utilisateur.getPrenom() + " " + utilisateur.getNom());
            System.out.println("🎯 Candidat: " + candidat.getNom());
            System.out.println("🔢 Référence: " + referenceVote);
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR ENREGISTREMENT VOTE: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Erreur lors de l'enregistrement du vote: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ VÉRIFIER SI L'UTILISATEUR A DÉJÀ VOTÉ
     */
    @GetMapping("/verifier/{userId}")
    public ResponseEntity<Map<String, Object>> verifierStatutVote(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean aDejaVote = voteRepository.existsByUtilisateurId(userId);
            response.put("success", true);
            response.put("aDejaVote", aDejaVote);
            
            if (aDejaVote) {
                Optional<Vote> voteOpt = voteRepository.findByUtilisateurId(userId);
                if (voteOpt.isPresent()) {
                    Vote vote = voteOpt.get();
                    response.put("dateVote", vote.getDateVote());
                    response.put("candidat", vote.getCandidat() != null ? vote.getCandidat().getNom() : null);
                }
            }
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR VÉRIFICATION VOTE: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Erreur lors de la vérification: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ GÉNÉRER UN CODE OTP
     */
    private String genererCodeOTP() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }
}