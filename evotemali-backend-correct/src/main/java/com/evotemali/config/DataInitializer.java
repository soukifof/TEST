package com.evotemali.config;

import com.evotemali.model.Utilisateur;
import com.evotemali.model.Vote;
import com.evotemali.repository.UtilisateurRepository;
import com.evotemali.repository.VoteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UtilisateurRepository utilisateurRepo, VoteRepository voteRepo) {
        return args -> {
            if (utilisateurRepo.count() == 0) {
                List<Utilisateur> utilisateurs = List.of(
                    new Utilisateur("Souki", "Demo", "souki@vote.ml", "98765432", "souki123", LocalDate.of(2000, 1, 1)),
                    new Utilisateur("Awa", "Diallo", "awa@vote.ml", "91234567", "awa123", LocalDate.of(1998, 5, 12)),
                    new Utilisateur("Moussa", "Traoré", "moussa@vote.ml", "93456789", "moussa123", LocalDate.of(1995, 3, 20))
                );
                utilisateurRepo.saveAll(utilisateurs);

                voteRepo.saveAll(List.of(
                    new Vote("Oui", utilisateurs.get(0)),
                    new Vote("Non", utilisateurs.get(1)),
                    new Vote("Oui", utilisateurs.get(2))
                ));

                System.out.println("✅ Utilisateurs et votes initiaux insérés !");
            }
        };
    }
}
