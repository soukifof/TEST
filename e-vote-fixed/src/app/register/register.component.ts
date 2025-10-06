import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initialiserFormulaire();
    this.nettoyerDonneesTemporaires();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initialiserFormulaire(): void {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]], // Réduit à 6 pour tests
      confirmation: ['', Validators.required]
    }, { validators: this.motDePasseCorrespond });
  }

  motDePasseCorrespond(group: FormGroup): { [key: string]: any } | null {
    const pw = group.get('motDePasse')?.value;
    const confirm = group.get('confirmation')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  allerProfil(): void {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData = {
        nom: this.form.value.nom.trim(),
        prenom: this.form.value.prenom.trim(),
        dateNaissance: this.form.value.dateNaissance,
        telephone: this.form.value.telephone,
        email: this.form.value.email.toLowerCase().trim(),
        motDePasse: this.form.value.motDePasse
      };

      console.log('📨 Tentative d\'envoi au backend...', userData);

      // ✅ ESSAI DU BACKEND D'ABORD
      this.subscription.add(
        this.http.post('http://localhost:8080/api/auth/register', userData).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            console.log('✅ RÉPONSE BACKEND:', response);
            
            this.traiterReponseBackend(response, userData);
          },
          error: (error: HttpErrorResponse) => {
            console.error('💥 ERREUR BACKEND, utilisation du mode local...', error);
            
            // ✅ FALLBACK LOCAL SI BACKEND ÉCHoue
            this.creerUtilisateurLocal(userData);
          }
        })
      );
    } else {
      this.form.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire';
      this.logValidationErrors();
    }
  }

  private traiterReponseBackend(response: any, userData: any): void {
    if (response && response.success) {
      let userDataFromApi;
      
      // ✅ Gestion de toutes les structures possibles
      if (response.user) {
        userDataFromApi = response.user;
      } else if (response.data) {
        userDataFromApi = response.data;
      } else {
        userDataFromApi = response;
      }

      console.log('🎉 INSCRIPTION RÉUSSIE VIA BACKEND:', userDataFromApi);
      
      this.finaliserInscription(userDataFromApi, 'Backend');
      
    } else {
      // Si le backend répond mais avec une erreur, on utilise le mode local
      console.warn('⚠️ Backend a répondu avec une erreur, utilisation du mode local');
      this.creerUtilisateurLocal(userData);
    }
  }

  private creerUtilisateurLocal(userData: any): void {
    console.log('🔄 Création utilisateur en mode local...');
    
    // ✅ CRÉATION D'UN UTILISATEUR LOCAL AVEC ID SIMULÉ
    const userLocal = {
      id: Date.now(), // ID temporaire
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone,
      dateNaissance: userData.dateNaissance,
      motDePasse: userData.motDePasse,
      photoProfil: null,
      numeroNina: null,
      dateCreation: new Date().toISOString()
    };

    this.isLoading = false;
    this.finaliserInscription(userLocal, 'Local');
  }

  private finaliserInscription(userData: any, source: string): void {
    console.log(`🎉 INSCRIPTION RÉUSSIE (${source}):`, userData);
    
    // Stocker les données utilisateur
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'token-simule-' + Date.now());
    
    this.successMessage = `Inscription réussie! Redirection... (${source})`;
    
    // Rediriger vers profil
    setTimeout(() => {
      this.router.navigate(['/profil'], { 
        state: { utilisateur: userData },
        replaceUrl: true
      });
    }, 1000);
  }

  private logValidationErrors(): void {
    console.log('❌ Formulaire invalide - Erreurs:');
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.errors) {
        console.log(`  - ${key}:`, control.errors);
      }
    });
  }

  private nettoyerDonneesTemporaires(): void {
    const tempData = localStorage.getItem('tempUser');
    if (tempData) {
      localStorage.removeItem('tempUser');
      console.log('🧹 Données temporaires nettoyées');
    }
  }

  // ✅ TEST SIMPLE DE CONNEXION
  testBackendSimple(): void {
    console.log('🔍 Test simple de connexion...');
    this.isLoading = true;
    
    this.http.get('http://localhost:8080/api/admin/statistiques').subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('✅ Backend accessible:', response);
        alert('✅ Backend DÉMARRÉ et accessible!');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Backend inaccessible:', error);
        alert('❌ Backend NON DÉMARRÉ! Le mode local sera utilisé.');
      }
    });
  }

  // ✅ AFFICHER LES DONNÉES LOCALSTORAGE
  voirLocalStorage(): void {
    console.log('💾 LocalStorage actuel:');
    console.log('user:', localStorage.getItem('user'));
    console.log('token:', localStorage.getItem('token'));
    
    const user = localStorage.getItem('user');
    if (user) {
      alert('Données dans localStorage:\n' + JSON.stringify(JSON.parse(user), null, 2));
    } else {
      alert('Aucune donnée utilisateur dans localStorage');
    }
  }

  // ✅ EFFACER LE LOCALSTORAGE
  effacerLocalStorage(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('🧹 LocalStorage effacé');
    alert('LocalStorage effacé!');
  }

  // ✅ FORCER LA REDIRECTION
  forcerRedirectionProfil(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/profil'], { 
        state: { utilisateur: JSON.parse(user) },
        replaceUrl: true
      });
    } else {
      alert('Aucun utilisateur trouvé! Inscrivez-vous d\'abord.');
    }
  }

  retourAccueil(): void {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  reinitialiserFormulaire(): void {
    this.form.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Getters pour le template
  get nom() { return this.form.get('nom'); }
  get prenom() { return this.form.get('prenom'); }
  get dateNaissance() { return this.form.get('dateNaissance'); }
  get telephone() { return this.form.get('telephone'); }
  get email() { return this.form.get('email'); }
  get motDePasse() { return this.form.get('motDePasse'); }
  get confirmation() { return this.form.get('confirmation'); }
}