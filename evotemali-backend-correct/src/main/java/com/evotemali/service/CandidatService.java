package com.evotemali.service;

import com.evotemali.model.Candidat;
import com.evotemali.repository.CandidatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidatService {
    
    private final CandidatRepository candidatRepository;
    
    public List<Candidat> getCandidatsActifs() {
        return candidatRepository.findByEstActifTrue();
    }
    
    public Candidat getCandidatById(Long id) {
        return candidatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));
    }
}