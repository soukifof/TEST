package com.evotemali.controller;

import com.evotemali.model.Candidat;
import com.evotemali.service.CandidatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CandidatController {
    
    private final CandidatService candidatService;
    
    @GetMapping
    public ResponseEntity<List<Candidat>> getCandidats() {
        List<Candidat> candidats = candidatService.getCandidatsActifs();
        return ResponseEntity.ok(candidats);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Candidat> getCandidat(@PathVariable Long id) {
        Candidat candidat = candidatService.getCandidatById(id);
        return ResponseEntity.ok(candidat);
    }
}