package com.evotemali.repository;

import com.evotemali.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    // ✅ RECHERCHE DE VOTE
    Optional<Vote> findByReferenceVote(String referenceVote);
    
    // ✅ VÉRIFICATIONS (CORRIGÉ : sans Electeur)
    boolean existsByNumeroElecteurAndEstValideTrue(String numeroElecteur);
    
    // ✅ STATISTIQUES
    long countByCandidatId(Long candidatId);
    
    // ✅ VOTES RÉCENTS
    List<Vote> findTop10ByOrderByDateVoteDesc();
    
    // ✅ VOTES PAR NUMÉRO ÉLECTEUR
    List<Vote> findByNumeroElecteur(String numeroElecteur);
    
    // ✅ VOTES VALIDES SEULEMENT
    long countByEstValideTrue();
    
    // ✅ VOTES PAR CANDIDAT ET VALIDITÉ
    long countByCandidatIdAndEstValideTrue(Long candidatId);
    
    // ✅ VOTES AVEC OTP VÉRIFIÉ
    List<Vote> findByOtpVerifieTrue();
    
    // ✅ STATISTIQUES AVANCÉES
    @Query("SELECT FUNCTION('DATE', v.dateVote), COUNT(v) FROM Vote v GROUP BY FUNCTION('DATE', v.dateVote)")
    List<Object[]> countVotesByDate();
    
    // ✅ VOTES PAR CANDIDAT
    @Query("SELECT v.candidat.nom, COUNT(v) FROM Vote v WHERE v.estValide = true GROUP BY v.candidat.nom")
    List<Object[]> countValidVotesPerCandidat();

    
    // ✅ Vérifier si un utilisateur a déjà voté
    boolean existsByUtilisateurId(Long utilisateurId);
    
    // ✅ Trouver le vote d'un utilisateur
    Optional<Vote> findByUtilisateurId(Long utilisateurId);
    
    // ✅ Vérifier si un numéro d'électeur a déjà voté
    boolean existsByNumeroElecteur(String numeroElecteur);
}