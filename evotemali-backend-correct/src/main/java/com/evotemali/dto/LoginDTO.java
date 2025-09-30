package com.evotemali.dto;

public class LoginDTO {
    private String prenom;
    private String nom;
    private String numero;
    private String telephone;
    private String email;
    private String motdepasse;

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotdepasse() { return motdepasse; }
    public void setMotdepasse(String motdepasse) { this.motdepasse = motdepasse; }

    @Override
    public String toString() {
        return "LoginDTO{" +
                "prenom='" + prenom + '\'' +
                ", nom='" + nom + '\'' +
                ", numero='" + numero + '\'' +
                ", telephone='" + telephone + '\'' +
                ", email='" + email + '\'' +
                ", motdepasse='" + motdepasse + '\'' +
                '}';
    }
}
