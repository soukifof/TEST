package com.evotemali.repository;

import com.evotemali.model.Electeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElecteurRepository extends JpaRepository<Electeur, Long> {
    Electeur findByNumeroNina(String numeroNina);
}
