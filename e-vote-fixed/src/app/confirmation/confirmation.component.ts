import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  nomCandidat: string = '';
  dateVote: Date = new Date();
  reference: string = '';
  candidat: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadVoteData();
  }

  /**
   * Charger les données du vote depuis l'état de navigation
   */
  private loadVoteData(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      nomCandidat?: string;
      dateVote?: Date;
      reference?: string;
      candidat?: any;
    };

    if (state) {
      this.nomCandidat = state.nomCandidat || 'Candidat';
      this.dateVote = state.dateVote || new Date();
      this.reference = state.reference || 'REF-' + Date.now();
      this.candidat = state.candidat;

      console.log('✅ Données de confirmation reçues:', state);
    } else {
      console.warn('⚠️ Aucune donnée de vote reçue');
      this.nomCandidat = 'Candidat non spécifié';
      this.reference = 'REF-' + Date.now();
    }
  }

  /**
   * Formater la date pour l'affichage
   */
  getFormattedDate(): string {
    return this.dateVote.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Télécharger le reçu de vote (simulation)
   */
  telechargerRecu(): void {
    const contenu = `
      RECU DE VOTE - E-VOTE MALI
      ============================
      Candidat: ${this.nomCandidat}
      Référence: ${this.reference}
      Date: ${this.getFormattedDate()}
      
      Votre vote a été enregistré avec succès.
      Merci pour votre participation !
      
      © 2024 E-Vote Mali - Système de vote électronique
    `;

    const blob = new Blob([contenu], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reçu_vote_${this.reference}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);

    console.log('📄 Reçu téléchargé:', this.reference);
  }

  /**
   * Retour à l'accueil
   */
  retourAccueil(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Voter à nouveau
   */
  voterEncore(): void {
    this.router.navigate(['/vote']);
  }

  /**
   * Voir le profil du candidat
   */
  voirProfilCandidat(): void {
    if (this.candidat) {
      this.router.navigate(['/candidat'], { state: { candidat: this.candidat } });
    } else {
      this.router.navigate(['/candidats']);
    }
  }
}