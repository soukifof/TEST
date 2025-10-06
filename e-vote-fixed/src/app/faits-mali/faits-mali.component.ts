import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faits-mali',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faits-mali.component.html',
  styleUrls: ['./faits-mali.component.css']
})
export class FaitsMaliComponent {
  constructor(private router: Router) {}

  retourAccueil() {
    this.router.navigate(['/home']); // Retour à la page d'accueil
  }
}
