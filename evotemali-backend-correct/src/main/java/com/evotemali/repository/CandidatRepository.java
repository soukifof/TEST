package com.evotemali.repository;

import com.evotemali.model.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidatRepository extends JpaRepository<Candidat, Long> {
    // ✅ AJOUTÉ : Trouver les candidats actifs
    List<Candidat> findByEstActifTrue();
    
    // Optionnel : Trouver par parti
    List<Candidat> findByParti(String parti);
}