package com.evotemali.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class VoteRequest {
    @NotBlank(message = "Le numéro électeur est obligatoire")
    private String numeroElecteur;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "(/^\\d{8}$/)", message = "Format de téléphone invalide")
    private String telephone;

    @NotBlank(message = "Le code OTP est obligatoire")
    @Pattern(regexp = "^\\d{6}$", message = "L'OTP doit contenir 6 chiffres")
    private String otpCode;



    private String photoCarte;

    @NotNull(message = "L'ID du candidat est obligatoire")
    private Long candidatId;
}