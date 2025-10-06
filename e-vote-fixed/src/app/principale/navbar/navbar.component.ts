import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  // Méthode utilisée dans les tests et dans le template
  go(path: string): void {
    this.router.navigate([path]);
  }

  // Getter pour afficher ou masquer la navbar selon la route
  get afficherNavbar(): boolean {
    const routesAvecNavbar = ['/principale', '/perso', '/conseils', '/vote', '/favoris', '/faits-mali'];
    return routesAvecNavbar.some(route => this.router.url.includes(route));
  }
}


