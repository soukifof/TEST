package com.evotemali.model;

import jakarta.persistence.*;

@Entity
@Table(name = "candidats")
public class Candidat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nom;
    
    private String photoUrl;
    private String slogan;
    private String parti;
    
    @Column(name = "est_actif")
    private Boolean estActif = true;
    
    // Constructeurs
    public Candidat() {}
    
    public Candidat(String nom, String photoUrl, String slogan, String parti) {
        this.nom = nom;
        this.photoUrl = photoUrl;
        this.slogan = slogan;
        this.parti = parti;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public String getSlogan() { return slogan; }
    public void setSlogan(String slogan) { this.slogan = slogan; }
    
    public String getParti() { return parti; }
    public void setParti(String parti) { this.parti = parti; }
    
    public Boolean getEstActif() { return estActif; }
    public void setEstActif(Boolean estActif) { this.estActif = estActif; }
}