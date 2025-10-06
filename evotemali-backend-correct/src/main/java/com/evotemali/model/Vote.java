package com.evotemali.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "votes")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String email;
    private String telephone;
    
    @Column(name = "numero_electeur")
    private String numeroElecteur;
    
    @Column(name = "reference_vote", unique = true)
    private String referenceVote;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_vote")
    private Date dateVote;
    
    @Column(name = "est_valide")
    private Boolean estValide = true;
    
    @Column(name = "code_otp")
    private String codeOtp;
    
    @Column(name = "otp_verifie")
    private Boolean otpVerifie = false;

    // Relation avec l'utilisateur
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    // Relation avec le candidat
    @ManyToOne
    @JoinColumn(name = "candidat_id")
    private Candidat candidat;

    // Constructeurs
    public Vote() {
        this.dateVote = new Date();
    }

    public Vote(String nom, String prenom, String email, String telephone, 
                String numeroElecteur, String referenceVote) {
        this();
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.numeroElecteur = numeroElecteur;
        this.referenceVote = referenceVote;
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

    public String getNumeroElecteur() { return numeroElecteur; }
    public void setNumeroElecteur(String numeroElecteur) { this.numeroElecteur = numeroElecteur; }

    public String getReferenceVote() { return referenceVote; }
    public void setReferenceVote(String referenceVote) { this.referenceVote = referenceVote; }

    public Date getDateVote() { return dateVote; }
    public void setDateVote(Date dateVote) { this.dateVote = dateVote; }

    public Boolean getEstValide() { return estValide; }
    public void setEstValide(Boolean estValide) { this.estValide = estValide; }

    public String getCodeOtp() { return codeOtp; }
    public void setCodeOtp(String codeOtp) { this.codeOtp = codeOtp; }

    public Boolean getOtpVerifie() { return otpVerifie; }
    public void setOtpVerifie(Boolean otpVerifie) { this.otpVerifie = otpVerifie; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public Candidat getCandidat() { return candidat; }
    public void setCandidat(Candidat candidat) { this.candidat = candidat; }

    @Override
    public String toString() {
        return "Vote{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", referenceVote='" + referenceVote + '\'' +
                ", dateVote=" + dateVote +
                ", candidat=" + (candidat != null ? candidat.getNom() : "null") +
                '}';
    }
}