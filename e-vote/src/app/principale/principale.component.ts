import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../services/backend.service';


@Component({
  selector: 'app-principale',
  standalone: true,
  imports: [CommonModule, NgIf, MatIconModule, RouterModule, HttpClientModule],
  templateUrl: './principale.component.html',
  styleUrls: ['./principale.component.css']
})
export class PrincipaleComponent implements OnInit, OnDestroy, AfterViewInit {
  infos: any;
  showModal = false;
  isClicked = false;

  salutation: string = '';
  heureLocale: string = '';
  utilisateur = {
    nom: '',
    prenom: '',
    email: '',
    numero: ''
  };

  votePercentage = 0;
  votersCount = 0;

  messages = [
    'Votre vote a bien été enregistré ✅',
    'Nouvelle mise à jour disponible 🔄',
    'Merci pour votre participation 🙏'
  ];

  proverbes = [
    {
      texteFr: "Le Séjour dans l'eau ne transforme pas un tronc d'arbre en crocodile.",
      texteBm: "Yiri courou mɛ̀ yo mɛ̀ dji la atekai bama yeh."
    },
    {
      texteFr: "Quand les tambours parlent, les sages écoutent.",
      texteBm: "Ni Dùndún bɛ̀ ká fô, hakilimanw bɛ̀ lamaili kai."
    },
    {
      texteFr: "La vérité triomphera toujours.",
      texteBm: "Galo mɛ̀ yo mɛ̀ tchiyen bɛ̀ banké."
    },
    {
      texteFr: "La parole est comme le vent : elle peut porter ou détruire.",
      texteBm: "Kán bɛ̀ nà yíri, bɛ̀ kɛ̀nɛya fɛ̀n bɛ̀nna."
    }
  ];

  proverbeDuMoment = this.proverbes[0];
  intervalId: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.infos = navigation?.extras?.state?.['infos'];

    if (!this.infos) {
      const stored = localStorage.getItem('infos');
      this.infos = stored ? JSON.parse(stored) : null;
    }

    if (this.infos) {
      this.utilisateur.nom = this.infos.nom || '';
      this.utilisateur.prenom = this.infos.prenom || '';
      this.utilisateur.email = this.infos.email || '';
      this.utilisateur.numero = this.infos.numero || '';
    }

    this.salutation = this.genererSalutation(this.utilisateur.prenom);
    this.heureLocale = new Date().toLocaleTimeString('fr-ML', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnInit(): void {
    this.animateCount('votePercentage', 72);
    this.animateCount('votersCount', 1345);
    this.changerProverbe();
    this.intervalId = setInterval(() => {
      this.changerProverbe();
    }, 60000);
  }

  ngAfterViewInit(): void {
    const images = document.querySelectorAll('.carousel-img');
    images.forEach(img => {
      img.addEventListener('click', () => {
        img.classList.add('clicked');
        setTimeout(() => {
          img.classList.remove('clicked');
        }, 300);
      });
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  animateCount(prop: 'votePercentage' | 'votersCount', target: number): void {
    let current = 0;
    const interval = setInterval(() => {
      if (current < target) {
        current++;
        this[prop] = current;
      } else {
        clearInterval(interval);
      }
    }, 10);
  }

  changerProverbe(): void {
    const index = Math.floor(Math.random() * this.proverbes.length);
    this.proverbeDuMoment = this.proverbes[index];
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  goToFaitsMali(): void {
    this.isClicked = true;
    setTimeout(() => {
      this.isClicked = false;
      this.router.navigateByUrl('/faits-mali');
    }, 300);
  }

  allerVersVote(): void {
    this.router.navigate(['/vote']);
  }

  genererSalutation(prenom: string): string {
    const heure = new Date().getHours();
    if (heure >= 5 && heure < 12) {
      return `Bonjour ${prenom} 🌞`;
    } else if (heure >= 12 && heure < 18) {
      return `Bon après-midi ${prenom} ☀️`;
    } else if (heure >= 18 && heure < 22) {
      return `Bonsoir ${prenom} 🌙`;
    } else {
      return `Bonne nuit ${prenom} 💤`;
    }
  }
}
