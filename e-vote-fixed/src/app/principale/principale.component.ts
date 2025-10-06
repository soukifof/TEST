import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';
import { of, Subscription, interval } from 'rxjs';

interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance?: string;
  photoProfil?: string;
  numeroNina?: string;
}

interface Proverbe {
  texteFr: string;
  texteBm: string;
}

interface VoteStats {
  percentage: number;
  votersCount: number;
  totalVoters: number;
}

interface Message {
  text: string;
  type: 'success' | 'info' | 'warning';
  timestamp: Date;
}

@Component({
  selector: 'app-principale',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './principale.component.html',
  styleUrls: ['./principale.component.css']
})
export class PrincipaleComponent implements OnInit, OnDestroy, AfterViewInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private subscriptions = new Subscription();

  utilisateur: Utilisateur = {
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  };

  showModal = false;
  isClicked = false;
  isLoading = false;
  isRefreshing = false;

  salutation = '';
  heureLocale = '';
  dateLocale = '';

  voteStats: VoteStats = {
    percentage: 0,
    votersCount: 0,
    totalVoters: 0
  };

  messages: Message[] = [
    { text: 'Votre vote a bien été enregistré ✅', type: 'success', timestamp: new Date() },
    { text: 'Nouvelle mise à jour disponible 🔄', type: 'info', timestamp: new Date() },
    { text: 'Merci pour votre participation 🙏', type: 'success', timestamp: new Date() }
  ];

  proverbes: Proverbe[] = [
    {
      texteFr: "Le Séjour dans l'eau ne transforme pas un tronc d'arbre en crocodile.",
      texteBm: "Yiri courou mɛ̀ yo mɛ̀ dji la atekai bama yeh."
    },
    {
      texteFr: "Quand les tambours parlent, les sages écoutent.",
      texteBm: "Ni Dùndún bɛ̀ ká fô, hakilimanw bɛ̀ lamaili kai."
    },
    {
      texteFr: "La vérité triomphera toujours.",
      texteBm: "Galo mɛ̀ yo mɛ̀ tchiyen bɛ̀ banké."
    },
    {
      texteFr: "La parole est comme le vent : elle peut porter ou détruire.",
      texteBm: "Kán bɛ̀ nà yíri, bɛ̀ kɛ̀nɛya fɛ̀n bɛ̀nna."
    }
  ];

  proverbeDuMoment = this.proverbes[0];
  private intervals: any[] = [];

  // Getters pour le template HTML
  get votersCount(): number {
    return this.voteStats.votersCount;
  }

  get votePercentage(): number {
    return this.voteStats.percentage;
  }

  constructor() {
    this.mettreAJourHeureEtDate();
  }

  ngOnInit(): void {
    this.chargerDonneesUtilisateur();
    this.chargerStatistiquesVotes();
    this.demarrerCycleProverbes();
    this.demarrerActualisationAutomatique();
  }

  ngAfterViewInit(): void {
    this.initialiserEffetsImages();
  }

  ngOnDestroy(): void {
    this.intervals.forEach(intervalId => clearInterval(intervalId));
    this.subscriptions.unsubscribe();
  }

  // ✅ MÉTHODE CORRIGÉE : Navigation vers page perso
  allerVersPerso(): void {
    console.log('🔄 Navigation vers page perso avec données:', this.utilisateur);
    
    this.router.navigate(['/perso'], {
      state: {
        infos: this.utilisateur,
        fromPrincipale: true
      }
    }).then(success => {
      if (success) {
        console.log('✅ Navigation vers perso réussie');
      } else {
        console.error('❌ Échec navigation vers perso');
        this.afficherErreurNavigation();
      }
    });
  }

  // ✅ MÉTHODE UNIQUE CORRIGÉE : Chargement des données utilisateur
  private chargerDonneesUtilisateur(): void {
    console.log('🔍 Chargement des données utilisateur...');
    
    // 1. Vérifier d'abord les données de navigation
    const navigation = this.router.getCurrentNavigation();
    const infosNavigation = navigation?.extras?.state?.['infos'];
    
    if (infosNavigation) {
      console.log('✅ Données reçues via navigation:', infosNavigation);
      this.utilisateur = { ...this.utilisateur, ...infosNavigation };
      localStorage.setItem('user', JSON.stringify(infosNavigation));
      this.mettreAJourSalutation();
      return;
    }

    // 2. Vérifier le localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        console.log('✅ Données trouvées dans localStorage:', userData);
        this.utilisateur = { ...this.utilisateur, ...userData };
        this.mettreAJourSalutation();
        return;
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
      }
    }

    // 3. Si aucune donnée, rediriger vers register
    console.warn('⚠️ Aucune donnée utilisateur trouvée, redirection vers register');
    this.router.navigate(['/register']);
  }

  private mettreAJourSalutation(): void {
    if (this.utilisateur.prenom) {
      this.salutation = this.genererSalutation(this.utilisateur.prenom);
    } else {
      this.salutation = this.genererSalutation('');
    }
    console.log('👋 Salutation:', this.salutation);
  }

  private chargerStatistiquesVotes(): void {
    this.isLoading = true;
    
    this.subscriptions.add(
      this.http.get<any>('http://localhost:8080/api/admin/statistiques')
        .pipe(
          take(1),
          catchError(error => {
            console.error('❌ Erreur chargement statistiques:', error);
            return of({ 
              totalVotes: 1345,
              totalCandidats: 6,
              votes: []
            });
          })
        )
        .subscribe(response => {
          console.log('📊 Statistiques reçues:', response);
          
          if (response && response.totalVotes !== undefined) {
            this.voteStats = {
              votersCount: response.totalVotes,
              totalVoters: 2000,
              percentage: Math.round((response.totalVotes / 2000) * 100)
            };
          } else {
            this.voteStats = { 
              percentage: 72, 
              votersCount: 1345, 
              totalVoters: 2000 
            };
          }
          
          this.animerCompteurs();
          this.isLoading = false;
        })
    );
  }

  private animerCompteurs(): void {
    this.animerCompteur('percentage', this.voteStats.percentage);
    this.animerCompteur('votersCount', this.voteStats.votersCount);
  }

  private animerCompteur(prop: keyof Omit<VoteStats, 'totalVoters'>, target: number): void {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.voteStats[prop] = Math.round(target);
        clearInterval(interval);
      } else {
        this.voteStats[prop] = Math.round(current);
      }
    }, stepTime);
  }

  private demarrerCycleProverbes(): void {
    this.changerProverbe();
    const intervalId = setInterval(() => {
      this.changerProverbe();
    }, 30000);
    this.intervals.push(intervalId);
  }

  private demarrerActualisationAutomatique(): void {
    const intervalId = setInterval(() => {
      if (!this.isRefreshing) {
        this.rafraichirStatistiques();
      }
    }, 120000);
    this.intervals.push(intervalId);

    const timeIntervalId = setInterval(() => {
      this.mettreAJourHeureEtDate();
    }, 60000);
    this.intervals.push(timeIntervalId);
  }

  private initialiserEffetsImages(): void {
    const images = document.querySelectorAll('.carousel-img');
    images.forEach(img => {
      img.addEventListener('click', () => {
        img.classList.add('clicked');
        setTimeout(() => {
          img.classList.remove('clicked');
        }, 300);
      });
    });
  }

  private mettreAJourHeureEtDate(): void {
    const now = new Date();
    this.heureLocale = now.toLocaleTimeString('fr-ML', {
      hour: '2-digit',
      minute: '2-digit'
    });
    this.dateLocale = now.toLocaleDateString('fr-ML', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  changerProverbe(): void {
    const currentIndex = this.proverbes.indexOf(this.proverbeDuMoment);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.proverbes.length);
    } while (newIndex === currentIndex && this.proverbes.length > 1);
    
    this.proverbeDuMoment = this.proverbes[newIndex];
  }

  rafraichirStatistiques(): void {
    this.isRefreshing = true;
    
    this.subscriptions.add(
      this.http.get<any>('http://localhost:8080/api/admin/statistiques')
        .pipe(
          take(1),
          catchError(error => {
            console.error('❌ Erreur rafraîchissement stats:', error);
            return of(null);
          })
        )
        .subscribe(response => {
          if (response && response.totalVotes !== undefined) {
            this.voteStats = {
              votersCount: response.totalVotes,
              totalVoters: 2000,
              percentage: Math.round((response.totalVotes / 2000) * 100)
            };
          }
          this.isRefreshing = false;
        })
    );
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  goToFaitsMali(): void {
    this.isClicked = true;
    setTimeout(() => {
      this.isClicked = false;
      this.router.navigateByUrl('/faits-mali');
    }, 300);
  }

  // ✅ MÉTHODE CORRIGÉE : Aller vers vote
  allerVersVote(): void {
    console.log('🗳️ Navigation vers vote avec utilisateur:', this.utilisateur);
    
    this.router.navigate(['/vote'], {
      state: {
        utilisateur: this.utilisateur
      }
    }).then(success => {
      if (success) {
        console.log('✅ Navigation vers vote réussie');
      } else {
        console.error('❌ Échec navigation vers vote');
        this.afficherErreurNavigation();
      }
    });
  }

  deconnexion(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tempUser');
    this.router.navigate(['/home']);
    
    this.http.post('http://localhost:8080/api/auth/logout', {})
      .pipe(take(1))
      .subscribe();
  }

  genererSalutation(prenom: string): string {
    const heure = new Date().getHours();
    let salutation = '';
    
    if (heure >= 5 && heure < 12) {
      salutation = 'Bonjour 🌞';
    } else if (heure >= 12 && heure < 18) {
      salutation = 'Bon après-midi ☀️';
    } else if (heure >= 18 && heure < 22) {
      salutation = 'Bonsoir 🌙';
    } else {
      salutation = 'Bonne nuit 💤';
    }
    
    return prenom ? `${salutation} ${prenom}` : salutation;
  }

  getPourcentageVotes(): number {
    if (this.voteStats.totalVoters === 0) return 0;
    return (this.voteStats.votersCount / this.voteStats.totalVoters) * 100;
  }

  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }

  // ✅ MÉTHODE DE DÉBOGAGE
  debugDonneesUtilisateur(): void {
    console.log('🐛 DEBUG Données utilisateur:', this.utilisateur);
    console.log('🐛 DEBUG LocalStorage user:', localStorage.getItem('user'));
    console.log('🐛 DEBUG Navigation state:', this.router.getCurrentNavigation()?.extras?.state);
    
    alert(`Données utilisateur:\n\n` +
          `Nom: ${this.utilisateur.nom}\n` +
          `Prénom: ${this.utilisateur.prenom}\n` +
          `Email: ${this.utilisateur.email}\n` +
          `NINA: ${this.utilisateur.numeroNina || 'Non renseigné'}\n` +
          `Photo: ${this.utilisateur.photoProfil ? 'Oui' : 'Non'}`);
  }

  // ✅ MÉTHODE POUR TESTER LA NAVIGATION
  testerNavigation(): void {
    console.log('🧪 Test de navigation...');
    
    // Test vers une page simple
    this.router.navigate(['/profil']).then(success => {
      if (success) {
        console.log('✅ Test navigation RÉUSSI');
        alert('Navigation fonctionne!');
      } else {
        console.error('❌ Test navigation ÉCHOUÉ');
        alert('Erreur de navigation!');
      }
    });
  }

  // ✅ MÉTHODE POUR AFFICHER LES ERREURS DE NAVIGATION
  private afficherErreurNavigation(): void {
    alert('Erreur de navigation! Vérifiez que la route existe dans app.routes.ts');
  }

  // ✅ MÉTHODE POUR FORCER LA NAVIGATION
  forcerNavigationVote(): void {
    console.log('⚡ Forcer navigation vers vote...');
    
    // Utiliser les données du localStorage si disponibles
    const userData = localStorage.getItem('user');
    const utilisateur = userData ? JSON.parse(userData) : this.utilisateur;
    
    this.router.navigate(['/vote'], {
      state: { utilisateur: utilisateur }
    }).then(success => {
      if (success) {
        console.log('✅ Navigation forcée réussie');
      } else {
        console.error('❌ Navigation forcée échouée');
        // Tentative de navigation simple
        this.router.navigate(['/vote']);
      }
    });
  }
}