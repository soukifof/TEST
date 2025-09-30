package com.evotemali.dto;

import jakarta.validation.constraints.Size;
import java.util.List;

public class VoteRequestDTO {
    private String nom;
    private String numeroNina;
    private String telephone;

    @Size(min = 1, message = "La liste ne peut pas être vide")
    private List<String> candidats;

    // Getters
    public String getNom() {
        return nom;
    }

    public String getNumeroNina() {
        return numeroNina;
    }

    public String getTelephone() {
        return telephone;
    }

    public List<String> getCandidats() {
        return candidats;
    }

    // Setters
    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setNumeroNina(String numeroNina) {
        this.numeroNina = numeroNina;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public void setCandidats(List<String> candidats) {
        this.candidats = candidats;
    }
}
