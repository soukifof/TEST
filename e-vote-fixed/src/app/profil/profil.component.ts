import { Router } from '@angular/router';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfilComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  typeImport: 'profil' | null = null;

  photoProfil: string | ArrayBuffer | null = null;
  infos: any = {};
  formulaireProfil: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.formulaireProfil = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]]
    });
  }

  ngOnInit(): void {
    this.chargerDonneesUtilisateur();
  }

  private chargerDonneesUtilisateur(): void {
    console.log('🔍 Chargement des données utilisateur...');
    
    const navigation = this.router.getCurrentNavigation();
    const infosNavigation = navigation?.extras?.state?.['utilisateur'];
    
    if (infosNavigation) {
      console.log('✅ Données reçues via navigation:', infosNavigation);
      this.infos = infosNavigation;
      this.preRemplirFormulaire();
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.infos = JSON.parse(storedUser);
        console.log('✅ Données trouvées dans localStorage:', this.infos);
        this.preRemplirFormulaire();
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
      }
    } else {
      console.error('❌ Aucun utilisateur trouvé!');
      this.errorMessage = 'Aucun utilisateur trouvé. Veuillez vous inscrire d\'abord.';
    }
  }

  private preRemplirFormulaire(): void {
    if (this.infos.numeroNina) {
      this.formulaireProfil.patchValue({
        numero: this.infos.numeroNina
      });
    }
    
    if (this.infos.photoProfil) {
      this.photoProfil = this.infos.photoProfil;
    }
  }

  ouvrirGalerie(type: 'profil'): void {
    this.typeImport = type;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.typeImport === 'profil') {
          this.photoProfil = reader.result;
          console.log('🖼️ Photo de profil chargée');
        }
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  // ✅ CORRECTION : Méthode SIMPLIFIÉE et GARANTIE
  allerprincipale(): void {
    console.log('🎯 BOUTON CRÉATION CLIQUE !');
    
    // ✅ VÉRIFICATION IMMÉDIATE : Le formulaire est-il valide ?
    if (!this.formulaireProfil.valid) {
      console.error('❌ Formulaire invalide:', this.formulaireProfil.errors);
      this.formulaireProfil.markAllAsTouched();
      this.errorMessage = 'Numéro NINA invalide (14 chiffres requis)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // ✅ PRÉPARATION DES DONNÉES SIMPLES
    const numeroNina = this.formulaireProfil.get('numero')?.value;
    
    console.log('📝 Données à sauvegarder:');
    console.log('  - Numéro NINA:', numeroNina);
    console.log('  - Photo:', this.photoProfil ? 'Présente' : 'Absente');
    console.log('  - ID utilisateur:', this.infos.id);

    // ✅ CRÉATION DES DONNÉES COMPLÈTES
    const donneesCompletes = {
      ...this.infos,
      photoProfil: this.photoProfil || this.infos.photoProfil || null,
      numeroNina: numeroNina
    };

    console.log('💾 Données complètes créées:', donneesCompletes);

    // ✅ SAUVEGARDE LOCALE IMMÉDIATE (GARANTIE)
    localStorage.setItem('user', JSON.stringify(donneesCompletes));
    console.log('✅ Données sauvegardées dans localStorage');

    // ✅ TENTATIVE DE SAUVEGARDE BACKEND (OPTIONNEL)
    if (this.infos.id) {
      console.log('🔄 Tentative de sauvegarde backend...');
      
      const donneesBackend = {
        id: this.infos.id,
        photoProfil: this.photoProfil,
        numeroNina: numeroNina
      };

      this.http.put(`http://localhost:8080/api/utilisateur/profil`, donneesBackend)
        .subscribe({
          next: (response: any) => {
            console.log('✅ Backend réponse:', response);
            this.successMessage = 'Profil créé et sauvegardé!';
            this.redirectionAvecSucces(donneesCompletes);
          },
          error: (error: HttpErrorResponse) => {
            console.warn('⚠️ Backend non disponible, continuation en mode local...', error);
            this.successMessage = 'Profil créé (sauvegarde locale)!';
            this.redirectionAvecSucces(donneesCompletes);
          }
        });
    } else {
      // ✅ MODE LOCAL SI PAS D'ID
      console.log('🔄 Mode local (sans ID)');
      this.successMessage = 'Profil créé avec succès!';
      this.redirectionAvecSucces(donneesCompletes);
    }
  }

  // ✅ NOUVELLE MÉTHODE : Redirection garantie
  private redirectionAvecSucces(donnees: any): void {
    this.isLoading = false;
    
    console.log('🎉 REDIRECTION VERS PRINCIPALE avec données:', donnees);
    
    // ✅ REDIRECTION IMMÉDIATE et GARANTIE
    setTimeout(() => {
      this.router.navigate(['/principale'], { 
        state: { infos: donnees }
      }).then(success => {
        if (success) {
          console.log('✅ Navigation réussie vers principale');
        } else {
          console.error('❌ Échec navigation, tentative alternative...');
          // ✅ SECOURS : Redirection simple sans state
          this.router.navigate(['/principale']);
        }
      });
    }, 500);
  }

  // ✅ MÉTHODE DE DÉBOGAGE ULTIME
  debugUltime(): void {
    console.log('🚨 === DEBUG ULTIME BOUTON CRÉATION ===');
    
    // 1. Vérifier le formulaire
    console.log('1. FORMULAIRE:');
    console.log('   - Valid:', this.formulaireProfil.valid);
    console.log('   - Value:', this.formulaireProfil.value);
    console.log('   - Errors:', this.formulaireProfil.errors);
    
    // 2. Vérifier les données utilisateur
    console.log('2. UTILISATEUR:');
    console.log('   - Infos:', this.infos);
    console.log('   - ID:', this.infos.id);
    console.log('   - Photo:', this.photoProfil);
    
    // 3. Vérifier le localStorage
    console.log('3. LOCALSTORAGE:');
    console.log('   - user:', localStorage.getItem('user'));
    
    // 4. Tester la navigation
    console.log('4. TEST NAVIGATION:');
    this.router.navigate(['/profil']).then(success => {
      console.log('   - Test navigation profil:', success);
    });
    
    console.log('🚨 === FIN DEBUG ===');
  }

  // ✅ MÉTHODE : Forcer la création IMMÉDIATE
  forcerCreationImmediate(): void {
    console.log('⚡ FORÇAGE CRÉATION IMMÉDIATE');
    
    // Forcer un numéro NINA valide
    this.formulaireProfil.patchValue({
      numero: '12345678901234'
    });

    // Créer des données complètes
    const donneesForcees = {
      id: this.infos.id || Date.now(),
      nom: this.infos.nom || 'Utilisateur Test',
      prenom: this.infos.prenom || 'Test',
      email: this.infos.email || 'test@test.com',
      telephone: this.infos.telephone || '00000000',
      photoProfil: this.photoProfil || 'default-photo',
      numeroNina: '12345678901234',
      dateNaissance: this.infos.dateNaissance || '2000-01-01'
    };

    console.log('⚡ Données forcées:', donneesForcees);
    
    // Sauvegarder
    localStorage.setItem('user', JSON.stringify(donneesForcees));
    this.successMessage = 'CRÉATION FORCÉE RÉUSSIE!';
    
    // Rediriger IMMÉDIATEMENT
    setTimeout(() => {
      this.router.navigate(['/principale'], { 
        state: { infos: donneesForcees }
      });
    }, 100);
  }

  // ✅ MÉTHODE : Test simple du bouton
  testBoutonSimple(): void {
    console.log('🧪 TEST SIMPLE BOUTON');
    
    // Simuler un clic sur le vrai bouton
    const numeroTest = '12345678901234';
    this.formulaireProfil.patchValue({ numero: numeroTest });
    
    console.log('🧪 Formulaire après patch:', this.formulaireProfil.valid);
    
    // Appeler la méthode directement
    this.allerprincipale();
  }

  retourAccueil(): void {
    this.router.navigate(['/register']);
  }

  get numero() { 
    return this.formulaireProfil.get('numero'); 
  }
}