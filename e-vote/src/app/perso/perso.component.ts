import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perso.component.html',
  styleUrls: ['./perso.component.css']
})
export class PersoComponent {
  infos: any;
  salutation: string = '';

  utilisateur = {
    nom: '',
    prenom: '',
    nina: '',
    email: '',
    telephone: '',
    photoProfil: 'assets/photos/souki-profil.jpg'
  };

  constructor(private router: Router) {
    const infos = JSON.parse(localStorage.getItem('infos') || '{}');

    this.utilisateur = {
      nom: infos.nom || '',
      prenom: infos.prenom || '',
      nina: infos.numero || '',
      email: infos.email || '',
      telephone: infos.telephone || '',
      photoProfil: infos.photoProfil || 'assets/photos/default-profil.jpg'
    };

    this.salutation = this.genererSalutation(this.utilisateur.prenom);
  }

  genererSalutation(prenom: string): string {
    const heure = new Date().getHours();
    if (heure >= 5 && heure < 12) {
      return `Bonjour ${prenom}🌞`;
    } else if (heure >= 12 && heure < 18) {
      return `Bon après-midi ${prenom}☀️`;
    } else if (heure >= 18 && heure < 22) {
      return `Bonsoir ${prenom}🌙`;
    } else {
      return `Bonne nuit ${prenom}💤`;
    }
  }
}
