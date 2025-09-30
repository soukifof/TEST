package com.evotemali.service;

import com.evotemali.model.Electeur;
import com.evotemali.repository.ElecteurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElecteurService {

    private final ElecteurRepository electeurRepository;

    public ElecteurService(ElecteurRepository electeurRepository) {
        this.electeurRepository = electeurRepository;
    }

    public List<Electeur> getAllElecteurs() {
        return electeurRepository.findAll();
    }
}
