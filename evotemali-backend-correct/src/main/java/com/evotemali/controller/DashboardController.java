package com.evotemali.controller;
import com.evotemali.dto.DashboardData;
import com.evotemali.model.Electeur;
import com.evotemali.model.Vote;
import com.evotemali.repository.ElecteurRepository;
import com.evotemali.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired
    private ElecteurRepository electeurRepository;

    @Autowired
    private VoteRepository voteRepository;

    @GetMapping("/dashboard")
    public DashboardData getDashboard() {
        List<Electeur> electeurs = electeurRepository.findAll();
        List<Vote> votes = voteRepository.findAll();
        return new DashboardData(electeurs, votes);
    }
}
