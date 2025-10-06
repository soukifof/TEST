package com.evotemali.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "utilisateur") // ✅ Vérifiez que c'est le bon nom de table
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String telephone;
    private String dateNaissance;
    
    @Column(nullable = false)
    private String motDePasse;
    
    // ✅ CHAMPS CRITIQUES POUR LE PROFIL
    private String numeroNina;
    
    @Column(length = 2000)
    private String photoProfil;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateModification;
    
    // Constructeurs
    public Utilisateur() {
        this.dateCreation = new Date();
        this.dateModification = new Date();
    }
    
    public Utilisateur(String nom, String prenom, String email, String telephone, String motDePasse) {
        this();
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.motDePasse = motDePasse;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public String getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(String dateNaissance) { this.dateNaissance = dateNaissance; }
    
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    
    public String getNumeroNina() { return numeroNina; }
    public void setNumeroNina(String numeroNina) { this.numeroNina = numeroNina; }
    
    public String getPhotoProfil() { return photoProfil; }
    public void setPhotoProfil(String photoProfil) { this.photoProfil = photoProfil; }
    
    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date dateCreation) { this.dateCreation = dateCreation; }
    
    public Date getDateModification() { return dateModification; }
    public void setDateModification(Date dateModification) { 
        this.dateModification = dateModification; 
    }
    
    @PreUpdate
    public void preUpdate() {
        this.dateModification = new Date();
    }
    
    @Override
    public String toString() {
        return "Utilisateur{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", email='" + email + '\'' +
                ", numeroNina='" + numeroNina + '\'' +
                ", photoProfil=" + (photoProfil != null ? "Oui" : "Non") +
                '}';
    }
}