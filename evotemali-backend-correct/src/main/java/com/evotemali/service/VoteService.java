package com.evotemali.service;

import com.evotemali.dto.VoteResponse;
import com.evotemali.model.Vote;
import com.evotemali.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    public VoteResponse enregistrerVote(Vote vote) {
        try {
            Vote voteSauvegarde = voteRepository.save(vote);
            
            return new VoteResponse(
                true,
                "Vote enregistré avec succès",
                voteSauvegarde.getReferenceVote(),
                voteSauvegarde.getDateVote(),
                voteSauvegarde.getCandidat() != null ? voteSauvegarde.getCandidat().getNom() : "Inconnu"
            );
            
        } catch (Exception e) {
            return new VoteResponse(false, "Erreur: " + e.getMessage(), null, null, null);
        }
    }

    public Optional<Vote> trouverVoteParReference(String reference) {
        return voteRepository.findByReferenceVote(reference);
    }

    public boolean utilisateurADejaVote(Long utilisateurId) {
        return voteRepository.existsByUtilisateurId(utilisateurId);
    }
}