import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent {
  electeurs: any[] = [];
  votes: any[] = [];

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:8080/api/dashboard').subscribe({
      next: (res: any) => {
        this.electeurs = res.electeurs;
        this.votes = res.votes;
      },
      error: (err) => {
        console.error('❌ Erreur dashboard :', err);
      }
    });
  }
}
