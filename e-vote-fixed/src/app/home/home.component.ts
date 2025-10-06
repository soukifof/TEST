import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  stats = {
    totalVotes: 0,
    totalCandidats: 0,
    participants: 0,
    votingActive: true
  };
  isLoading: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }

  private loadStats(): void {
    this.isLoading = true;

    this.subscription.add(
      this.http.get('http://localhost:8080/api/stats').subscribe({
        next: (stats: any) => {
          this.stats = {
            totalVotes: stats.totalVotes || 0,
            totalCandidats: stats.totalCandidats || 0,
            participants: stats.participants || 0,
            votingActive: stats.votingActive !== false
          };
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur chargement stats:', error);
          this.loadFallbackStats();
          this.isLoading = false;
        }
      })
    );
  }

  private loadFallbackStats(): void {
    this.stats = {
      totalVotes: 1247,
      totalCandidats: 6,
      participants: 893,
      votingActive: true
    };
  }

  // Méthodes pour le template
  getWelcomeMessage(): string {
    if (this.currentUser) {
      return `Bon retour, ${this.currentUser.prenom} !`;
    }
    return 'Bienvenue sur E-Vote Mali';
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Navigation
  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  onGetStarted(): void {
    if (this.currentUser) {
      this.router.navigate(['/vote']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  // Formatage
  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }
}