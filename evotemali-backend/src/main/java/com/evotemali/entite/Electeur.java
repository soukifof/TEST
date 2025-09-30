package com.evotemali.entite;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Electeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String numero;
    private String motDePasse;
    private boolean compteComplet;

    // Constructeurs
    public Electeur() {}

    public Electeur(String nom, String prenom, String email, String numero, String motDePasse, boolean compteComplet) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.numero = numero;
        this.motDePasse = motDePasse;
        this.compteComplet = compteComplet;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getMotDePasse() {
        return motDePasse;
    }
    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public boolean isCompteComplet() {
        return compteComplet;
    }
    public void setCompteComplet(boolean compteComplet) {
        this.compteComplet = compteComplet;
    }
}
