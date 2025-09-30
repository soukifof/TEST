import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent {
  constructor(private router: Router) {}

  candidats = [
    {
      nom: 'Candidat 1',
      photoUrl: 'assets/img5.jpg',
      slogan: 'Pour une jeunesse engagée 🇲🇱',
      afficherSlogan: false
    },
    {
      nom: 'Candidat 2',
      photoUrl: 'assets/img3.jpg',
      slogan: 'Justice et progrès pour tous',
      afficherSlogan: false
    },
    {
      nom: 'Candidat 3',
      photoUrl: 'assets/samori.jpg',
      slogan: 'Un avenir durable pour le Mali',
      afficherSlogan: false
    },
    {
      nom: 'Candidat 4',
      photoUrl: 'assets/img7.jpg',
      slogan: 'Solidarité et innovation',
      afficherSlogan: false
    },
    {
      nom: 'Candidat 5',
      photoUrl: 'assets/img8.jpg',
      slogan: 'L’éducation au cœur du changement',
      afficherSlogan: false
    },
    {
      nom: 'Candidat 6',
      photoUrl: 'assets/m26.jpg',
      slogan: 'Un Mali fort et uni',
      afficherSlogan: false
    }
  ];

  candidatChoisi: any = null;

  allerfavoris(candidat: any): void {
    this.candidatChoisi = candidat;
    console.log('Vote enregistré pour :', this.candidatChoisi.nom);
    this.router.navigate(['/favoris'], {
      state: { candidatChoisi: candidat }
    });
  }

  afficherSlogan(candidat: any): void {
    this.candidats.forEach(c => (c.afficherSlogan = false));
    candidat.afficherSlogan = true;
  }

  trackByNom(index: number, item: any): string {
    return item.nom;
  }
  
} // ← FIN de la classe
