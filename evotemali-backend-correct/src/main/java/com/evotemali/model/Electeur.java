package com.evotemali.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "electeurs")
@Data
public class Electeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "numero_electeur", unique = true, nullable = false)
    private String numeroElecteur;

    @NotBlank
    @Email
    @Column(nullable = false)
    private String email;

    @NotBlank
    @Pattern(regexp = "^(76|77|78|79|90|91)\\d{6}$")
    @Column(nullable = false)
    private String telephone;

    @Column(name = "photo_carte")
    private String photoCarte;

    @Column(name = "est_verifie")
    private Boolean estVerifie = false;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription = LocalDateTime.now();

    @Column(name = "est_actif")
    private Boolean estActif = true;
}