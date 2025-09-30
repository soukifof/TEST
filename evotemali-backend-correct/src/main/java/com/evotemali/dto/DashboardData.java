package com.evotemali.dto;

import com.evotemali.model.Electeur;
import com.evotemali.model.Vote;
import java.util.List;

public class DashboardData {
    private List<Electeur> electeurs;
    private List<Vote> votes;

    public DashboardData(List<Electeur> electeurs, List<Vote> votes) {
        this.electeurs = electeurs;
        this.votes = votes;
    }

    public List<Electeur> getElecteurs() {
        return electeurs;
    }

    public List<Vote> getVotes() {
        return votes;
    }
}
