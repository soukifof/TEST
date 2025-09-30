import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  formulaireLogin: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.formulaireLogin = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(1)]],
      nom: ['', [Validators.required, Validators.minLength(1)]],
      numero: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      motdepasse: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  retourAccueil(): void {
    this.router.navigate(['/home']);
  }

  onSeConnecter(): void {
    console.log('✅ Bouton cliqué');

    if (this.formulaireLogin.valid) {
      const infos = this.formulaireLogin.value;

      this.http.post('http://localhost:8080/api/login', infos).subscribe({
        next: (res) => {
          console.log('✅ Réponse du backend :', res);
          localStorage.setItem('infos', JSON.stringify(infos));
          this.router.navigate(['/principale'], { state: { infos } });
        },
        error: (err) => {
          console.error('❌ Erreur backend :', err);
        }
      });
    } else {
      this.formulaireLogin.markAllAsTouched();
      console.log('❌ Formulaire invalide');
    }
  }
}
