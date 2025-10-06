package com.evotemali.service;

import com.evotemali.model.Utilisateur;
import com.evotemali.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UtilisateurService implements UserDetailsService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email);
        }

        Utilisateur utilisateur = userOpt.get();
        
        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotDePasse())
                .authorities(Collections.singletonList(() -> "ROLE_USER")) // ✅ Rôle par défaut
                .build();
    }
    
    // ✅ MÉTHODE UTILITAIRE POUR TROUVER PAR EMAIL
    public Optional<Utilisateur> trouverParEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }
    
    // ✅ MÉTHODE UTILITAIRE POUR VÉRIFIER L'EXISTENCE
    public boolean existeParEmail(String email) {
        return utilisateurRepository.existsByEmail(email);
    }
}