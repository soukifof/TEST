package com.evotemali.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "electeur") // facultatif mais recommandé
public class Electeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String numeroNina;
    private String telephone;
    private String langue;
    private String otp;
    private LocalDateTime otpExpiration;

    public Electeur() {}

    public Electeur(String nom, String numeroNina, String telephone, String langue, String otp, LocalDateTime otpExpiration) {
        this.nom = nom;
        this.numeroNina = numeroNina;
        this.telephone = telephone;
        this.langue = langue;
        this.otp = otp;
        this.otpExpiration = otpExpiration;
    }

    public Electeur(String nom, String numeroNina) {
        this.nom = nom;
        this.numeroNina = numeroNina;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNumeroNina() {
        return numeroNina;
    }

    public void setNumeroNina(String numeroNina) {
        this.numeroNina = numeroNina;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getLangue() {
        return langue;
    }

    public void setLangue(String langue) {
        this.langue = langue;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiration() {
        return otpExpiration;
    }

    public void setOtpExpiration(LocalDateTime otpExpiration) {
        this.otpExpiration = otpExpiration;
    }

    @Override
    public String toString() {
        return "Electeur{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", numeroNina='" + numeroNina + '\'' +
                ", telephone='" + telephone + '\'' +
                ", langue='" + langue + '\'' +
                ", otp='" + otp + '\'' +
                ", otpExpiration=" + otpExpiration +
                '}';
    }
}
