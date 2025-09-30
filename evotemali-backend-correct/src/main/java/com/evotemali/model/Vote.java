package com.evotemali.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String choix;

    private LocalDateTime date_vote;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public Vote() {}

    public Vote(String choix, Utilisateur utilisateur) {
        this.choix = choix;
        this.utilisateur = utilisateur;
        this.date_vote = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChoix() {
        return choix;
    }

    public void setChoix(String choix) {
        this.choix = choix;
    }

    public LocalDateTime getDate_vote() {
        return date_vote;
    }

    public void setDate_vote(LocalDateTime date_vote) {
        this.date_vote = date_vote;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    @Override
    public String toString() {
        return "Vote{" +
               "id=" + id +
               ", choix='" + choix + '\'' +
               ", date_vote=" + date_vote +
               ", utilisateur=" + (utilisateur != null ? utilisateur.getNom() : "null") +
               '}';
    }
}
