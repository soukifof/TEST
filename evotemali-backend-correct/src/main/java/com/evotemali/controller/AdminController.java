package com.evotemali.controller;

import com.evotemali.repository.CandidatRepository;
import com.evotemali.repository.UtilisateurRepository;
import com.evotemali.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private CandidatRepository candidatRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    /**
     * ✅ ENDPOINT COMPLET : Toutes les données organisées
     */
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("📊 CHARGEMENT DES STATISTIQUES...");
            
            // 📊 STATISTIQUES GLOBALES
            long totalCandidats = candidatRepository.count();
            long totalVotes = voteRepository.count();
            long totalUtilisateurs = utilisateurRepository.count();
            
            response.put("totalCandidats", totalCandidats);
            response.put("totalVotes", totalVotes);
            response.put("totalUtilisateurs", totalUtilisateurs);
            
            System.out.println("🎯 Candidats: " + totalCandidats + ", Votes: " + totalVotes + ", Utilisateurs: " + totalUtilisateurs);

            // 🎭 LISTE DES CANDIDATS
            List<Map<String, Object>> candidatsList = candidatRepository.findAll().stream()
                .map(candidat -> {
                    Map<String, Object> candidatMap = new LinkedHashMap<>();
                    candidatMap.put("id", candidat.getId());
                    candidatMap.put("nom", candidat.getNom());
                    candidatMap.put("photoUrl", candidat.getPhotoUrl());
                    candidatMap.put("slogan", candidat.getSlogan());
                    candidatMap.put("parti", candidat.getParti());
                    candidatMap.put("estActif", candidat.getEstActif());
                    candidatMap.put("nombreVotes", voteRepository.countByCandidatId(candidat.getId()));
                    return candidatMap;
                })
                .collect(Collectors.toList());
            response.put("candidats", candidatsList);

            // 👥 LISTE COMPLÈTE DES UTILISATEURS
            List<com.evotemali.model.Utilisateur> allUsers = utilisateurRepository.findAll();
            System.out.println("👥 UTILISATEURS TROUVÉS: " + allUsers.size());
            
            List<Map<String, Object>> utilisateursList = allUsers.stream()
                .map(utilisateur -> {
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
                    
                    // ✅ Ajouter le statut de vote
                    boolean aVote = voteRepository.existsByUtilisateurId(utilisateur.getId());
                    userMap.put("aVote", aVote);
                    
                    return userMap;
                })
                .collect(Collectors.toList());
            response.put("utilisateurs", utilisateursList);

            // 🗳️ LISTE DES VOTES AVEC RELATIONS COMPLÈTES
            List<Map<String, Object>> votesList = voteRepository.findAll().stream()
                .map(vote -> {
                    Map<String, Object> voteMap = new LinkedHashMap<>();
                    voteMap.put("id", vote.getId());
                    voteMap.put("nom", vote.getNom());
                    voteMap.put("prenom", vote.getPrenom());
                    voteMap.put("referenceVote", vote.getReferenceVote());
                    voteMap.put("numeroElecteur", vote.getNumeroElecteur());
                    voteMap.put("email", vote.getEmail());
                    voteMap.put("telephone", vote.getTelephone());
                    voteMap.put("dateVote", vote.getDateVote());
                    voteMap.put("estValide", vote.getEstValide());
                    voteMap.put("codeOtp", vote.getCodeOtp());
                    voteMap.put("otpVerifie", vote.getOtpVerifie());
                    
                    // ✅ INFORMATIONS CANDIDAT COMPLÈTES
                    if (vote.getCandidat() != null) {
                        voteMap.put("candidatId", vote.getCandidat().getId());
                        voteMap.put("candidatNom", vote.getCandidat().getNom());
                        voteMap.put("candidatParti", vote.getCandidat().getParti());
                        voteMap.put("candidatPhoto", vote.getCandidat().getPhotoUrl());
                    } else {
                        voteMap.put("candidatId", null);
                        voteMap.put("candidatNom", "Non spécifié");
                        voteMap.put("candidatParti", "Non spécifié");
                    }
                    
                    // ✅ INFORMATIONS UTILISATEUR (si lié)
                    if (vote.getUtilisateur() != null) {
                        voteMap.put("utilisateurId", vote.getUtilisateur().getId());
                        voteMap.put("utilisateurNomComplet", 
                            vote.getUtilisateur().getPrenom() + " " + vote.getUtilisateur().getNom());
                        voteMap.put("utilisateurEmail", vote.getUtilisateur().getEmail());
                        voteMap.put("utilisateurTelephone", vote.getUtilisateur().getTelephone());
                    } else {
                        voteMap.put("utilisateurId", null);
                        voteMap.put("utilisateurNomComplet", "Compte non lié");
                    }
                    
                    return voteMap;
                })
                .collect(Collectors.toList());
            response.put("votes", votesList);
            
            // 📈 STATISTIQUES AVANCÉES
            Map<String, Object> statsAvancees = new HashMap<>();
            
            // Pourcentage de participation
            double tauxParticipation = totalUtilisateurs > 0 ? 
                (double) totalVotes / totalUtilisateurs * 100 : 0;
            statsAvancees.put("tauxParticipation", Math.round(tauxParticipation * 100.0) / 100.0);
            
            // Nombre d'utilisateurs n'ayant pas voté
            long utilisateursSansVote = totalUtilisateurs - totalVotes;
            statsAvancees.put("utilisateursSansVote", utilisateursSansVote);
            
            response.put("statistiquesAvancees", statsAvancees);
            response.put("success", true);
            response.put("message", "Données récupérées avec succès");
            
            System.out.println("✅ STATISTIQUES CHARGÉES AVEC SUCCÈS");
            System.out.println("📈 Taux de participation: " + statsAvancees.get("tauxParticipation") + "%");
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR STATISTIQUES: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("error", "Erreur: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ ENDPOINT : Seulement les utilisateurs
     */
    @GetMapping("/utilisateurs")
    public ResponseEntity<Map<String, Object>> getUtilisateursComplets() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<com.evotemali.model.Utilisateur> utilisateurs = utilisateurRepository.findAll();
            System.out.println("👥 CHARGEMENT DE " + utilisateurs.size() + " UTILISATEURS");
            
            List<Map<String, Object>> utilisateursList = utilisateurs.stream()
                .map(utilisateur -> {
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
                    
                    // ✅ Ajouter le statut de vote
                    boolean aVote = voteRepository.existsByUtilisateurId(utilisateur.getId());
                    userMap.put("aVote", aVote);
                    
                    // ✅ Si l'utilisateur a voté, ajouter les détails du vote
                    if (aVote) {
                        voteRepository.findByUtilisateurId(utilisateur.getId()).ifPresent(vote -> {
                            if (vote.getCandidat() != null) {
                                userMap.put("candidatVote", vote.getCandidat().getNom());
                                userMap.put("partiVote", vote.getCandidat().getParti());
                            }
                            userMap.put("dateVote", vote.getDateVote());
                            userMap.put("referenceVote", vote.getReferenceVote());
                        });
                    }
                    
                    return userMap;
                })
                .collect(Collectors.toList());
            
            response.put("success", true);
            response.put("total", utilisateurs.size());
            response.put("utilisateurs", utilisateursList);
            
            // 📊 Statistiques des utilisateurs
            long totalAVote = utilisateursList.stream().filter(user -> (Boolean) user.get("aVote")).count();
            long totalSansVote = utilisateurs.size() - totalAVote;
            
            response.put("statistiques", Map.of(
                "totalAVote", totalAVote,
                "totalSansVote", totalSansVote,
                "tauxVote", utilisateurs.size() > 0 ? Math.round((double) totalAVote / utilisateurs.size() * 100) : 0
            ));
            
            System.out.println("✅ UTILISATEURS CHARGÉS: " + utilisateurs.size());
            System.out.println("🗳️ Utilisateurs ayant voté: " + totalAVote);
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR UTILISATEURS: " + e.getMessage());
            response.put("success", false);
            response.put("error", "Erreur: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ ENDPOINT : Statistiques de vote simplifiées
     */
    @GetMapping("/statistiques-votes")
    public ResponseEntity<Map<String, Object>> getStatistiquesVotes() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("📊 CHARGEMENT DES STATISTIQUES DE VOTE...");
            
            // 📊 STATISTIQUES GLOBALES
            long totalCandidats = candidatRepository.count();
            long totalVotes = voteRepository.count();
            long totalUtilisateurs = utilisateurRepository.count();
            
            response.put("totalCandidats", totalCandidats);
            response.put("totalVotes", totalVotes);
            response.put("totalUtilisateurs", totalUtilisateurs);
            
            // 🎭 STATISTIQUES PAR CANDIDAT
            List<Map<String, Object>> statsCandidats = candidatRepository.findAll().stream()
                .map(candidat -> {
                    long nombreVotes = voteRepository.countByCandidatId(candidat.getId());
                    double pourcentage = totalVotes > 0 ? (double) nombreVotes / totalVotes * 100 : 0;
                    
                    Map<String, Object> stats = new LinkedHashMap<>();
                    stats.put("id", candidat.getId());
                    stats.put("nom", candidat.getNom());
                    stats.put("photoUrl", candidat.getPhotoUrl());
                    stats.put("slogan", candidat.getSlogan());
                    stats.put("parti", candidat.getParti());
                    stats.put("estActif", candidat.getEstActif());
                    stats.put("nombreVotes", nombreVotes);
                    stats.put("pourcentage", Math.round(pourcentage * 100.0) / 100.0);
                    return stats;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("nombreVotes"), (Long) a.get("nombreVotes")))
                .collect(Collectors.toList());
            response.put("candidats", statsCandidats);
            
            response.put("success", true);
            response.put("message", "Statistiques de vote récupérées avec succès");
            
            System.out.println("✅ STATISTIQUES DE VOTE CHARGÉES: " + totalVotes + " votes");
            
        } catch (Exception e) {
            System.err.println("💥 ERREUR STATISTIQUES VOTE: " + e.getMessage());
            response.put("success", false);
            response.put("error", "Erreur: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ ENDPOINT : Détails d'un utilisateur spécifique
     */
    @GetMapping("/utilisateur/{id}")
    public ResponseEntity<Map<String, Object>> getUtilisateurById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            java.util.Optional<com.evotemali.model.Utilisateur> utilisateurOpt = utilisateurRepository.findById(id);
            
            if (!utilisateurOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            com.evotemali.model.Utilisateur utilisateur = utilisateurOpt.get();
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
            
            // ✅ Informations de vote
            boolean aVote = voteRepository.existsByUtilisateurId(utilisateur.getId());
            userMap.put("aVote", aVote);
            
            if (aVote) {
                voteRepository.findByUtilisateurId(utilisateur.getId()).ifPresent(vote -> {
                    userMap.put("dateVote", vote.getDateVote());
                    userMap.put("referenceVote", vote.getReferenceVote());
                    if (vote.getCandidat() != null) {
                        userMap.put("candidatVote", vote.getCandidat().getNom());
                        userMap.put("partiVote", vote.getCandidat().getParti());
                        userMap.put("candidatPhoto", vote.getCandidat().getPhotoUrl());
                    }
                });
            }
            
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