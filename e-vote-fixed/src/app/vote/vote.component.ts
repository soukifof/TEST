import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface Candidat {
  id: number;
  nom: string;
  photoUrl: string;
  slogan: string;
  afficherSlogan: boolean;
  votesCount?: number;
  parti?: string;
}

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit, OnDestroy {
  trackByCandidatId(index: number, candidat: Candidat): number {
    return candidat.id;
  }
  candidats: Candidat[] = [];
  candidatChoisi: Candidat | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCandidats();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadCandidats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscription.add(
      this.http.get('http://localhost:8080/api/candidats').subscribe({
        next: (candidats: any) => {
          this.candidats = candidats.map((c: any) => ({
            ...c,
            afficherSlogan: false
          }));
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erreur chargement candidats:', error);
          this.loadFallbackCandidats();
        }
      })
    );
  }

  private loadFallbackCandidats(): void {
    this.candidats = [
      { id: 1, nom: 'Candidat 1', photoUrl: 'img5.jpg', slogan: 'Pour une jeunesse engagée 🇲🇱', afficherSlogan: false },
      { id: 2, nom: 'Candidat 2', photoUrl: 'img3.jpg', slogan: 'Justice et progrès pour tous', afficherSlogan: false },
      { id: 3, nom: 'Candidat 3', photoUrl: 'samori.jpg', slogan: 'Un avenir durable pour le Mali', afficherSlogan: false },
      { id: 4, nom: 'Candidat 4', photoUrl: 'img7.jpg', slogan: 'Solidarité et innovation', afficherSlogan: false },
      { id: 5, nom: 'Candidat 5', photoUrl: 'img8.jpg', slogan: 'L\'éducation au cœur du changement', afficherSlogan: false },
      { id: 6, nom: 'Candidat 6', photoUrl: 'm26.jpg', slogan: 'Un Mali fort et uni', afficherSlogan: false }
    ];
  }

  allerfavoris(candidat: Candidat): void {
    if (!this.isUserLoggedIn()) {
      this.router.navigate(['/favoris'], { 
        queryParams: { returnUrl: '/vote' } 
      });
      return;
    }

    this.candidatChoisi = candidat;
    
    this.router.navigate(['/favoris'], { 
      state: { candidatChoisi: candidat } 
    });
  }

  afficherSlogan(candidat: Candidat): void {
    this.candidats.forEach(c => (c.afficherSlogan = false));
    candidat.afficherSlogan = true;
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  // Nouvelle méthode pour le template
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}