import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', Validators.required]
    }, { validators: this.motDePasseCorrespond });
  }

  motDePasseCorrespond(group: FormGroup): null | { mismatch: true } {
    const pw = group.get('motDePasse')?.value;
    const confirm = group.get('confirmation')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  retourAccueil(): void {
    this.router.navigate(['/home']);
  }

  allerProfil(): void {
    if (this.form.valid) {
      const utilisateur = {
        nom: this.form.value.nom,
        prenom: this.form.value.prenom,
        dateNaissance: this.form.value.dateNaissance,
        telephone: this.form.value.telephone,
        email: this.form.value.email,
        photoProfil: 'assets/avatar-souki.png',
        photoCarte: 'assets/carte-souki.jpg'
      };

      localStorage.setItem('infos', JSON.stringify(utilisateur)); // ✅ Stockage local

      console.log("✅ Inscription réussie :", utilisateur);

      this.router.navigate(['/profil'], {
        state: { utilisateur }
      });
    } else {
      this.form.markAllAsTouched();
      console.log("❌ Formulaire invalide ou mot de passe non confirmé");
    }
  }
}
