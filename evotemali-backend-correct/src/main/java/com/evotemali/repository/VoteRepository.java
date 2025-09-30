package com.evotemali.repository;

import com.evotemali.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    // Vérifie si un numéro a déjà voté
    boolean existsByTelephone(String telephone);

    // Compte les votes par candidat
    @Query("SELECT v.candidat, COUNT(v) FROM Vote v GROUP BY v.candidat")
    List<Object[]> countVotesByCandidat();

    // Récupère tous les votes pour un candidat donné
    List<Vote> findByCandidat(String candidat);

    // Vérifie si un numéro a voté pour un candidat précis
   boolean existsByNumeroNina(String numeroNina);

}
