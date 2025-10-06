package com.evotemali.repository;

import com.evotemali.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    
    // Trouver par email
    Optional<Utilisateur> findByEmail(String email);
    
    // Vérifier si email existe
    boolean existsByEmail(String email);
    
    // ✅ AJOUTER cette méthode manquante
    boolean existsByTelephone(String telephone);
    
    // Trouver par téléphone
    Optional<Utilisateur> findByTelephone(String telephone);
    
    // Compter le nombre d'utilisateurs
    long count();
    
    // Recherche par nom ou prénom
    @Query("SELECT u FROM Utilisateur u WHERE u.nom LIKE %:keyword% OR u.prenom LIKE %:keyword%")
    java.util.List<Utilisateur> findByNomOrPrenomContaining(@Param("keyword") String keyword);
}