import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-redirect',
  template: `<p>Redirection en cours...</p>`
})
export class StartRedirectComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Exemple de logique : redirection selon une préférence fictive
    const userPrefersFavoris = this.getUserPreference(); // à adapter selon ton app

    if (userPrefersFavoris) {
      this.router.navigate(['/favoris']);
    } else {
      this.router.navigate(['/vote']);
    }
  }

  getUserPreference(): boolean {
    // Remplace ceci par une vraie logique (localStorage, service, etc.)
    return Math.random() > 0.5; // juste pour simuler
  }
}
