import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElecteurService } from '../electeur/electeur.service';

@Component({
  selector: 'app-electeur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './electeur.component.html'
})
export class ElecteurComponent {
  nom = '';
  numeroTelephone = '';

  constructor(private electeurService: ElecteurService) {}

  enregistrer() {
    this.electeurService.registerElecteur({
      nom: this.nom,
      numeroTelephone: this.numeroTelephone
    }).subscribe({
      next: (response) => console.log('✅ Réponse du backend:', response),
      error: (err) => console.error('❌ Erreur:', err)
    });
  }
}
