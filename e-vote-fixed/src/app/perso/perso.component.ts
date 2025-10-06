import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perso.component.html',
  styleUrls: ['./perso.component.css']
})
export class PersoComponent implements OnInit {
  utilisateur = {
    nom: '',
    prenom: '',
    nina: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    photoProfil: 'assets/images/photos/default-profil.jpg'
  };

  salutation: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chargerDonneesUtilisateur();
  }

  private chargerDonneesUtilisateur(): void {
    console.log('🔍 Chargement des données pour page perso...');
    
    // 1. Vérifier d'abord les données de navigation
    const navigation = this.router.getCurrentNavigation();
    const infosNavigation = navigation?.extras?.state?.['infos'];
    
    if (infosNavigation) {
      console.log('✅ Données reçues via navigation state:', infosNavigation);
      this.mettreAJourUtilisateur(infosNavigation);
      localStorage.setItem('user', JSON.stringify(infosNavigation));
      return;
    }

    // 2. Vérifier l'historique du router
    if (history.state && history.state.infos) {
      console.log('✅ Données reçues via history state:', history.state.infos);
      this.mettreAJourUtilisateur(history.state.infos);
      localStorage.setItem('user', JSON.stringify(history.state.infos));
      return;
    }

    // 3. Vérifier le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('✅ Données trouvées dans localStorage:', userData);
        this.mettreAJourUtilisateur(userData);
        return;
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
      }
    }

    console.warn('⚠️ Aucune donnée utilisateur trouvée pour la page perso');
    
    // Debug complet
    this.debugDonnees();
  }

  private mettreAJourUtilisateur(donnees: any): void {
    this.utilisateur = { 
      ...this.utilisateur, 
      nom: donnees.nom || '',
      prenom: donnees.prenom || '',
      nina: donnees.numeroNina || donnees.numero || donnees.nina || '',
      email: donnees.email || '',
      telephone: donnees.telephone || '',
      dateNaissance: donnees.dateNaissance || '',
      photoProfil: donnees.photoProfil || this.utilisateur.photoProfil
    };
    this.mettreAJourSalutation();
  }

  private mettreAJourSalutation(): void {
    this.salutation = this.genererSalutation(this.utilisateur.prenom);
    console.log('🎉 Salutation mise à jour:', this.salutation);
  }

  genererSalutation(prenom: string): string {
    const heure = new Date().getHours();
    if (heure >= 5 && heure < 12) {
      return `Bonjour ${prenom} 🌞`;
    } else if (heure >= 12 && heure < 18) {
      return `Bon après-midi ${prenom} ☀️`;
    } else if (heure >= 18 && heure < 22) {
      return `Bonsoir ${prenom} 🌙`;
    } else {
      return `Bonne nuit ${prenom} 💤`;
    }
  }

  // Méthode de debug
  debugDonnees(): void {
    console.log('🐛 DEBUG Perso Component:');
    console.log('- Utilisateur affiché:', this.utilisateur);
    console.log('- Navigation state:', this.router.getCurrentNavigation()?.extras?.state);
    console.log('- History state:', history.state);
    console.log('- LocalStorage:', localStorage.getItem('user'));
  }

  retourPrincipale(): void {
    this.router.navigate(['/principale']);
  }
}