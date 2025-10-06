package com.evotemali.repository;

import com.evotemali.model.Electeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ElecteurRepository extends JpaRepository<Electeur, Long> {
    Optional<Electeur> findByNumeroElecteur(String numeroElecteur);
    Optional<Electeur> findByEmail(String email);
    Optional<Electeur> findByTelephone(String telephone);
    boolean existsByNumeroElecteur(String numeroElecteur);
    boolean existsByEmail(String email);
}
