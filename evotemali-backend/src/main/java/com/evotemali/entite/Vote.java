// ✅ À corriger
package com.evotemali.entite;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String candidat;
    private String email;
    private String numero;
    private String otp;

    private LocalDateTime dateVote;

    @PrePersist
    protected void onCreate() {
        this.dateVote = LocalDateTime.now();
    }

    // Getters et Setters
}
