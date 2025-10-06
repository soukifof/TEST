import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class FavorisComponent implements OnInit {
  @Input() candidatChoisi: any = null;
  nomCandidat: string = '';
  formulaireVote: FormGroup;
  tentativesOtp: number = 0;
  maxTentatives: number = 3;
  otpEnvoye: boolean = false;
  otpGenere: string = '';
  isLoading: boolean = false;

  // Mode test - activer pour tester sans backend
  modeTest: boolean = true;
  private codeOtpTest: string = "123456"; // ⬅️ CODE OTP FIXE POUR TESTS

  // Informations de l'utilisateur connecté
  utilisateurConnecte: any = null;
  nomUtilisateur: string = '';
  prenomUtilisateur: string = '';
  emailUtilisateur: string = '';
  telephoneUtilisateur: string = '';
  ninaUtilisateur: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  photoCarte: string | ArrayBuffer | null = null;
  typeImport: 'carte' | null = null;
  afficherCarte: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.formulaireVote = this.createVoteForm();
  }

  ngOnInit(): void {
    console.log('🚀 Initialisation de la page favoris');
    if (this.modeTest) {
      console.log('🔧 MODE TEST ACTIVÉ - Backend non requis');
    }
    this.recupererUtilisateurConnecte();
    this.initializeCandidatData();
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  private recupererUtilisateurConnecte(): void {
    console.log('🔄 Récupération des données utilisateur...');

    this.reinitialiserDonneesUtilisateur();

    // En mode test, utiliser les données simulées
    if (this.modeTest) {
      console.log('🔧 MODE TEST: Utilisation des données simulées');
      this.utiliserDonneesSimulees();
      return;
    }

    // Mode production - vérifier d'abord les données de navigation
    const navigation = this.router.getCurrentNavigation();
    const infosNavigation = navigation?.extras?.state?.['infos'];
    
    if (infosNavigation) {
      console.log('✅ Données reçues via navigation:', infosNavigation);
      this.mettreAJourDonneesUtilisateur(infosNavigation);
      return;
    }

    // Vérifier l'état de l'historique
    const state = history.state;
    if (state && state['infos']) {
      console.log('✅ Données reçues via history state:', state['infos']);
      this.mettreAJourDonneesUtilisateur(state['infos']);
      return;
    }

    // Depuis le localStorage
    const userData = localStorage.getItem('utilisateurConnecte');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        console.log('✅ Données trouvées dans localStorage:', parsedData);
        this.mettreAJourDonneesUtilisateur(parsedData);
        return;
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
        localStorage.removeItem('utilisateurConnecte');
      }
    }

    // Vérifier l'ancienne clé pour compatibilité
    const oldUserData = localStorage.getItem('user');
    if (oldUserData) {
      try {
        const parsedData = JSON.parse(oldUserData);
        console.log('✅ Données trouvées dans ancien localStorage:', parsedData);
        this.mettreAJourDonneesUtilisateur(parsedData);
        localStorage.setItem('utilisateurConnecte', oldUserData);
        return;
      } catch (error) {
        console.error('❌ Erreur parsing ancien localStorage:', error);
      }
    }

    // Appel API pour récupérer le profil utilisateur
    this.recupererProfilUtilisateur();
  }

  /**
   * Utiliser des données simulées pour les tests
   */
  private utiliserDonneesSimulees(): void {
    const userData = localStorage.getItem('utilisateurConnecte');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        console.log('🔧 MODE TEST: Données depuis localStorage:', parsedData);
        this.mettreAJourDonneesUtilisateur(parsedData);
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
        this.creerDonneesTestParDefaut();
      }
    } else {
      this.creerDonneesTestParDefaut();
    }
  }

  /**
   * Créer des données de test par défaut
   */
  private creerDonneesTestParDefaut(): void {
    console.log('🔧 MODE TEST: Création de données de test par défaut');
    
    const donneesTest = {
      id: 1,
      nom: 'UTILISATEUR',
      prenom: 'Test',
      email: 'test@example.com',
      telephone: '76123456',
      numeroNina: '12345678901234'
    };

    this.mettreAJourDonneesUtilisateur(donneesTest);
    localStorage.setItem('utilisateurConnecte', JSON.stringify(donneesTest));
  }

  /**
   * Réinitialiser les données utilisateur
   */
  private reinitialiserDonneesUtilisateur(): void {
    this.utilisateurConnecte = null;
    this.nomUtilisateur = '';
    this.prenomUtilisateur = '';
    this.emailUtilisateur = '';
    this.telephoneUtilisateur = '';
    this.ninaUtilisateur = '';
    this.formulaireVote.reset();
  }

  /**
   * Mettre à jour les données utilisateur
   */
  private mettreAJourDonneesUtilisateur(donnees: any): void {
    this.utilisateurConnecte = donnees;
    this.nomUtilisateur = donnees.nom || '';
    this.prenomUtilisateur = donnees.prenom || '';
    this.emailUtilisateur = donnees.email || '';
    this.telephoneUtilisateur = donnees.telephone || '';
    this.ninaUtilisateur = donnees.numeroNina || donnees.nina || donnees.numeroElecteur || '';

    console.log('📝 Données utilisateur mises à jour:', {
      nom: this.nomUtilisateur,
      prenom: this.prenomUtilisateur,
      email: this.emailUtilisateur,
      telephone: this.telephoneUtilisateur,
      nina: this.ninaUtilisateur
    });

    this.preRemplirFormulaire();
  }

  /**
   * Récupérer le profil utilisateur depuis le backend
   */
  private recupererProfilUtilisateur(): void {
    console.log('📡 Récupération du profil utilisateur depuis le backend...');
    
    this.http.get('http://localhost:8080/api/utilisateurs/profil').subscribe({
      next: (profil: any) => {
        console.log('✅ Profil utilisateur récupéré depuis backend:', profil);
        this.mettreAJourDonneesUtilisateur(profil);
        localStorage.setItem('utilisateurConnecte', JSON.stringify(profil));
      },
      error: (error: any) => {
        console.error('❌ Erreur récupération profil utilisateur:', error);
        
        if (error.status === 401) {
          this.showAlert('🔒 Vous devez être connecté pour voter. Redirection vers la page de connexion...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.verifierDonneesLocales();
        }
      }
    });
  }

  /**
   * Vérifier les données locales en dernier recours
   */
  private verifierDonneesLocales(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showAlert('🔒 Session expirée. Veuillez vous reconnecter.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    this.showAlert('❌ Erreur de chargement du profil. Veuillez vous reconnecter.');
    this.deconnexion();
  }

  /**
   * Déconnexion forcée
   */
  private deconnexion(): void {
    localStorage.removeItem('utilisateurConnecte');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  /**
   * Pré-remplir le formulaire avec les données utilisateur
   */
  private preRemplirFormulaire(): void {
    if (this.utilisateurConnecte) {
      this.formulaireVote.patchValue({
        numeroElecteur: this.ninaUtilisateur,
        email: this.emailUtilisateur,
        telephone: this.telephoneUtilisateur
      });

      console.log('📝 Formulaire pré-rempli avec:', {
        nina: this.ninaUtilisateur,
        email: this.emailUtilisateur,
        telephone: this.telephoneUtilisateur
      });

      setTimeout(() => {
        if (this.ninaUtilisateur) {
          this.formulaireVote.get('numeroElecteur')?.markAsTouched();
        }
        if (this.emailUtilisateur) {
          this.formulaireVote.get('email')?.markAsTouched();
        }
        if (this.telephoneUtilisateur) {
          this.formulaireVote.get('telephone')?.markAsTouched();
        }
      }, 100);
    }
  }

  /**
   * Création du formulaire de vote
   */
  private createVoteForm(): FormGroup {
    return this.fb.group({
      numeroElecteur: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^\d+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]],
      otpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      confirmation: [false, Validators.requiredTrue],
      photoCarte: [null, Validators.required]
    });
  }

  /**
   * Initialisation des données du candidat
   */
  private initializeCandidatData(): void {
    console.log('🔍 Début de l\'initialisation des données du candidat');

    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras?.state) {
      this.candidatChoisi = navigation.extras.state['candidatChoisi'];
      if (this.candidatChoisi) {
        this.nomCandidat = this.candidatChoisi.nom;
        console.log('✅ Candidat reçu via navigation state:', this.nomCandidat);
        localStorage.setItem('candidatChoisi', JSON.stringify(this.candidatChoisi));
        return;
      }
    }

    const state = history.state;
    if (state && state['candidatChoisi']) {
      this.candidatChoisi = state['candidatChoisi'];
      this.nomCandidat = this.candidatChoisi.nom;
      console.log('✅ Candidat reçu via history state:', this.nomCandidat);
      localStorage.setItem('candidatChoisi', JSON.stringify(this.candidatChoisi));
      return;
    }

    const candidatStorage = localStorage.getItem('candidatChoisi');
    if (candidatStorage) {
      try {
        this.candidatChoisi = JSON.parse(candidatStorage);
        this.nomCandidat = this.candidatChoisi.nom;
        console.log('✅ Candidat reçu via localStorage:', this.nomCandidat);
        return;
      } catch (error) {
        console.error('❌ Erreur parsing localStorage:', error);
        localStorage.removeItem('candidatChoisi');
      }
    }

    this.route.queryParams.subscribe(params => {
      if (params['candidat']) {
        try {
          this.candidatChoisi = JSON.parse(params['candidat']);
          this.nomCandidat = this.candidatChoisi.nom;
          console.log('✅ Candidat reçu via query params:', this.nomCandidat);
          localStorage.setItem('candidatChoisi', JSON.stringify(this.candidatChoisi));
        } catch (error) {
          console.error('❌ Erreur parsing query params:', error);
        }
      }
    });

    this.route.paramMap.subscribe(params => {
      const candidatId = params.get('candidatId');
      if (candidatId) {
        this.loadCandidatFromBackend(candidatId);
      }
    });

    setTimeout(() => {
      if (!this.candidatChoisi) {
        console.warn('⚠️ Aucun candidat trouvé');
        this.showAlert('⚠️ Aucun candidat sélectionné. Redirection vers la page de vote...');
        setTimeout(() => {
          this.router.navigate(['/vote']);
        }, 2000);
      }
    }, 2000);
  }

  /**
   * Charger le candidat depuis le backend
   */
  private loadCandidatFromBackend(candidatId: string): void {
    console.log('📡 Chargement du candidat:', candidatId);
    
    this.http.get(`http://localhost:8080/api/candidats/${candidatId}`).subscribe({
      next: (candidat: any) => {
        this.candidatChoisi = candidat;
        this.nomCandidat = candidat.nom;
        localStorage.setItem('candidatChoisi', JSON.stringify(this.candidatChoisi));
        console.log('✅ Candidat chargé depuis backend:', this.nomCandidat);
      },
      error: (error) => {
        console.error('❌ Erreur chargement candidat:', error);
        this.showAlert('❌ Erreur lors du chargement du candidat');
      }
    });
  }

  /**
   * Générer un code OTP
   */
  private genererOtp(): string {
    if (this.modeTest) {
      console.log('🔧 MODE TEST: OTP fixe utilisé:', this.codeOtpTest);
      console.log('💡 POUR TESTER, UTILISEZ CE CODE OTP:', this.codeOtpTest);
      
      // Afficher une alerte avec le code OTP en mode test
      this.showAlert(`🔧 MODE TEST ACTIVÉ\n\n📱 Votre code OTP est: ${this.codeOtpTest}\n\nUtilisez ce code pour valider votre vote.`);
      
      return this.codeOtpTest;
    } else {
      // Mode production - OTP aléatoire
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('🔐 OTP généré:', otp);
      return otp;
    }
  }

  /**
   * Envoyer les informations et générer l'OTP
   */
  async envoyerInfos(): Promise<void> {
    if (this.formulaireVote.invalid) {
      this.markFormAsTouched();
      this.showAlert('❌ Veuillez remplir tous les champs correctement.');
      return;
    }

    if (!this.candidatChoisi) {
      this.showAlert('❌ Aucun candidat sélectionné.');
      return;
    }

    if (!this.utilisateurConnecte) {
      this.showAlert('❌ Vous devez être connecté pour voter.');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;

    try {
      const { numeroElecteur, email, telephone } = this.formulaireVote.value;
      
      // Générer l'OTP
      this.otpGenere = this.genererOtp();
      
      // Préparer les données pour l'envoi OTP
      const otpData = {
        utilisateurId: this.utilisateurConnecte.id,
        nom: this.nomUtilisateur,
        prenom: this.prenomUtilisateur,
        numeroElecteur: numeroElecteur,
        email: email,
        telephone: telephone,
        otp: this.otpGenere,
        candidatId: this.candidatChoisi.id,
        candidatNom: this.candidatChoisi.nom
      };

      console.log('📨 Données OTP préparées:', otpData);

      if (this.modeTest) {
        // MODE TEST: Simulation d'envoi
        console.log('🔧 MODE TEST: Simulation d\'envoi OTP');
        setTimeout(() => {
          this.isLoading = false;
          this.otpEnvoye = true;
          this.showAlert(`✅ Code OTP ${this.otpGenere} généré avec succès!\n\nMode test activé - Aucun SMS réel envoyé.`);
          console.log('🔐 Code OTP pour test:', this.otpGenere);
        }, 1500);
      } else {
        // MODE PRODUCTION: Appel réel au backend
        this.http.post('http://localhost:8080/api/votes/generer-otp', otpData).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            if (response.success) {
              this.otpEnvoye = true;
              this.showAlert(`✅ Code OTP envoyé avec succès à ${this.prenomUtilisateur}. Vérifiez votre téléphone.`);
            } else {
              this.showAlert(`❌ ${response.message}`);
            }
          },
          error: (error: any) => {
            this.isLoading = false;
            console.error('❌ Erreur envoi OTP:', error);
            
            // Simulation en cas d'erreur backend
            this.simulerEnvoiSMS(telephone);
            this.otpEnvoye = true;
            this.showAlert(`✅ Code OTP envoyé avec succès à ${this.prenomUtilisateur}. Vérifiez votre téléphone.`);
          }
        });
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
      this.showAlert('❌ Erreur lors de l\'envoi. Veuillez réessayer.');
      this.isLoading = false;
    }
  }

  /**
   * Simuler l'envoi de SMS (fallback)
   */
  private async simulerEnvoiSMS(telephone: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📱 SMS simulé vers ${telephone} pour ${this.prenomUtilisateur} ${this.nomUtilisateur}: Votre code OTP est ${this.otpGenere}`);
        console.log(`🔐 Code OTP généré: ${this.otpGenere}`);
        resolve();
      }, 1500);
    });
  }

  /**
   * Valider le vote avec l'OTP
   */
  async validerVote(): Promise<void> {
    if (!this.candidatChoisi) {
      this.showAlert('❌ Aucun candidat sélectionné.');
      return;
    }

    if (!this.utilisateurConnecte) {
      this.showAlert('❌ Vous devez être connecté pour voter.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.formulaireVote.invalid) {
      this.markFormAsTouched();
      this.showAlert('❌ Veuillez remplir tous les champs correctement.');
      return;
    }

    const otpSaisi = this.formulaireVote.get('otpCode')?.value;

    if (otpSaisi !== this.otpGenere) {
      this.tentativesOtp++;
      
      if (this.tentativesOtp >= this.maxTentatives) {
        this.showAlert('🚫 Trop de tentatives échouées. Veuillez recommencer le processus.');
        this.resetOtpProcess();
        return;
      }
      
      const tentativesRestantes = this.maxTentatives - this.tentativesOtp;
      this.showAlert(`❌ Code OTP incorrect. ${tentativesRestantes} tentative(s) restante(s).`);
      return;
    }

    // OTP correct - Enregistrer le vote
    this.enregistrerVote();
  }

  /**
   * Enregistrer le vote dans la base de données
   */
  private enregistrerVote(): void {
    this.isLoading = true;

    // Préparer les données pour l'API
    const voteData = {
      utilisateurId: this.utilisateurConnecte.id,
      nom: this.nomUtilisateur,
      prenom: this.prenomUtilisateur,
      numeroElecteur: this.formulaireVote.value.numeroElecteur,
      email: this.formulaireVote.value.email,
      telephone: this.formulaireVote.value.telephone,
      otpCode: this.formulaireVote.value.otpCode,
      photoCarte: this.photoCarte,
      candidatId: this.candidatChoisi.id,
      candidatNom: this.candidatChoisi.nom,
      dateVote: new Date().toISOString()
    };

    console.log('🗳️ Données de vote préparées:', voteData);

    if (this.modeTest) {
      // MODE TEST: Simulation d'enregistrement
      console.log('🔧 MODE TEST: Simulation d\'enregistrement du vote');
      
      setTimeout(() => {
        this.isLoading = false;
        
        // Générer une référence de vote simulée
        const referenceVote = 'TEST-' + Date.now();
        
        this.showAlert(`✅ Vote enregistré avec succès en mode test!\n\nRéférence: ${referenceVote}\nCandidat: ${this.candidatChoisi.nom}`);
        
        // Nettoyer le localStorage après vote réussi
        localStorage.removeItem('candidatChoisi');
        
        // Redirection vers la page de confirmation
        this.router.navigate(['/confirmation'], {
          state: { 
            nom: this.nomUtilisateur,
            prenom: this.prenomUtilisateur,
            nomCandidat: this.candidatChoisi.nom,
            dateVote: new Date().toISOString(),
            reference: referenceVote,
            candidat: this.candidatChoisi,
            simulated: true
          }
        });
      }, 2000);
    } else {
      // MODE PRODUCTION: Appel réel au backend
      this.http.post('http://localhost:8080/api/votes/enregistrer', voteData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('✅ Réponse du backend:', response);
          
          if (response.success) {
            this.showAlert(`✅ ${response.message}`);
            localStorage.removeItem('candidatChoisi');
            
            this.router.navigate(['/confirmation'], {
              state: { 
                nom: response.nom || this.nomUtilisateur,
                prenom: response.prenom || this.prenomUtilisateur,
                nomCandidat: response.nomCandidat || this.candidatChoisi.nom,
                dateVote: response.dateVote || new Date().toISOString(),
                reference: response.referenceVote || 'REF-' + Date.now(),
                candidat: this.candidatChoisi
              }
            });
          } else {
            this.showAlert(`❌ ${response.message}`);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('❌ Erreur lors de l\'enregistrement du vote:', error);
          
          if (error.status === 0) {
            this.showAlert('❌ Impossible de se connecter au serveur. Vérifiez que le backend Spring Boot est démarré.');
            this.simulerEnregistrementVote(voteData);
          } else if (error.status === 400) {
            this.showAlert('❌ Données invalides. Vérifiez les informations saisies.');
          } else if (error.status === 409) {
            this.showAlert('❌ Vous avez déjà voté avec ce numéro d\'électeur.');
          } else if (error.status === 500) {
            this.showAlert('❌ Erreur interne du serveur. Veuillez réessayer plus tard.');
          } else {
            this.showAlert('❌ Erreur serveur: ' + error.message);
          }
        }
      });
    }
  }

  /**
   * Simulation d'enregistrement en cas d'erreur backend
   */
  private simulerEnregistrementVote(voteData: any): void {
    console.log('🔄 Simulation d\'enregistrement du vote:', voteData);
    
    const simulatedResponse = {
      success: true,
      message: 'Vote enregistré avec succès (mode simulation)',
      referenceVote: 'SIM-' + Date.now(),
      nom: voteData.nom,
      prenom: voteData.prenom,
      nomCandidat: voteData.candidatNom,
      dateVote: new Date().toISOString()
    };

    this.showAlert('✅ Vote enregistré en mode simulation (backend non disponible)');
    
    setTimeout(() => {
      this.router.navigate(['/confirmation'], {
        state: { 
          nom: simulatedResponse.nom,
          prenom: simulatedResponse.prenom,
          nomCandidat: simulatedResponse.nomCandidat,
          dateVote: simulatedResponse.dateVote,
          reference: simulatedResponse.referenceVote,
          candidat: this.candidatChoisi,
          simulated: true
        }
      });
    }, 1500);
  }

  /**
   * Obtenir le nom complet de l'utilisateur
   */
  getNomComplet(): string {
    return `${this.prenomUtilisateur} ${this.nomUtilisateur}`.trim();
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  estConnecte(): boolean {
    return !!this.utilisateurConnecte;
  }

  /**
   * Rediriger vers la page de connexion
   */
  redirigerVersConnexion(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Réinitialiser le processus OTP
   */
  private resetOtpProcess(): void {
    this.otpEnvoye = false;
    this.otpGenere = '';
    this.tentativesOtp = 0;
    this.formulaireVote.get('otpCode')?.reset();
  }

  /**
   * Marquer tous les champs du formulaire comme touchés
   */
  private markFormAsTouched(): void {
    Object.keys(this.formulaireVote.controls).forEach(key => {
      const control = this.formulaireVote.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Afficher une alerte
   */
  private showAlert(message: string): void {
    alert(message);
  }

  /**
   * Retour à la page de vote
   */
  retourVote(): void {
    localStorage.removeItem('candidatChoisi');
    this.router.navigate(['/vote']);
  }

  /**
   * Retour à l'accueil
   */
  retourAccueil(): void {
    localStorage.removeItem('candidatChoisi');
    this.router.navigate(['/home']);
  }

  /**
   * Ouvrir la galerie pour importer une photo
   */
  ouvrirGalerie(type: 'carte'): void {
    this.typeImport = type;
    this.fileInput.nativeElement.click();
  }

  /**
   * Gérer la sélection de fichier
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!this.validateFile(file)) {
      this.formulaireVote.patchValue({ photoCarte: null });
      input.value = '';
      return;
    }

    this.processSelectedFile(file);
  }

  /**
   * Valider le fichier sélectionné
   */
  private validateFile(file: File): boolean {
    const isImage = file.type.startsWith('image/');
    const isSizeValid = file.size <= 5 * 1024 * 1024;

    if (!isImage) {
      this.showAlert('❌ Veuillez sélectionner une image valide (JPG, PNG, etc.).');
      return false;
    }

    if (!isSizeValid) {
      this.showAlert('❌ Fichier trop volumineux. Maximum 5 Mo.');
      return false;
    }

    return true;
  }

  /**
   * Traiter le fichier sélectionné
   */
  private processSelectedFile(file: File): void {
    this.formulaireVote.patchValue({ photoCarte: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.photoCarte = reader.result;
      this.afficherCarte = true;
      this.showAlert('✅ Photo de carte importée avec succès !');
    };
    reader.onerror = () => {
      this.showAlert('❌ Erreur lors de la lecture du fichier.');
      this.formulaireVote.patchValue({ photoCarte: null });
    };
    reader.readAsDataURL(file);
  }

  /**
   * Getter pour faciliter l'accès aux contrôles du formulaire
   */
  get f() { 
    return this.formulaireVote.controls; 
  }

  /**
   * Vérifier si un champ est invalide et a été touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formulaireVote.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtenir le message d'erreur pour un champ
   */
  getFieldError(fieldName: string): string {
    const field = this.formulaireVote.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    if (errors['required']) return 'Ce champ est obligatoire';
    if (errors['email']) return 'Format d\'email invalide';
    if (errors['pattern']) {
      if (fieldName === 'telephone') return 'Format de téléphone invalide (ex: 76123456)';
      if (fieldName === 'otpCode') return 'Le code OTP doit contenir 6 chiffres';
      if (fieldName === 'numeroElecteur') return 'Numéro NINA invalide';
    }
    if (errors['minlength']) return 'Trop court';
    
    return 'Erreur de validation';
  }

  /**
   * Rafraîchir les données utilisateur
   */
  rafraichirDonneesUtilisateur(): void {
    console.log('🔄 Rafraîchissement manuel des données utilisateur');
    this.recupererUtilisateurConnecte();
  }

  /**
   * Vérifier les données actuelles (pour debug)
   */
  debugDonneesUtilisateur(): void {
    console.log('🐛 DEBUG Données utilisateur actuelles:', {
      utilisateurConnecte: this.utilisateurConnecte,
      nom: this.nomUtilisateur,
      prenom: this.prenomUtilisateur,
      email: this.emailUtilisateur,
      telephone: this.telephoneUtilisateur,
      nina: this.ninaUtilisateur
    });

    console.log('🐛 DEBUG LocalStorage:', {
      utilisateurConnecte: localStorage.getItem('utilisateurConnecte'),
      user: localStorage.getItem('user'),
      token: localStorage.getItem('token')
    });

    console.log('🐛 DEBUG Formulaire:', this.formulaireVote.value);
  }

  /**
   * Vérifier le mode actuel
   */
  getModeTest(): string {
    return this.modeTest ? '🔧 MODE TEST ACTIVÉ' : '🚀 MODE PRODUCTION';
  }

  /**
   * Basculer entre mode test et production
   */
  basculerModeTest(): void {
    this.modeTest = !this.modeTest;
    console.log('🔄 Mode changé:', this.getModeTest());
    this.showAlert(`Mode changé: ${this.getModeTest()}`);
  }

  /**
   * Récupération forcée du profil utilisateur
   */
  private recupererProfilUtilisateurForce(): void {
    console.log('📡 Récupération forcée du profil utilisateur depuis le backend...');
    
    this.http.get('http://localhost:8080/api/utilisateurs/profil').subscribe({
      next: (profil: any) => {
        console.log('✅ Profil utilisateur récupéré depuis backend:', profil);
        this.mettreAJourDonneesUtilisateur(profil);
        localStorage.setItem('utilisateurConnecte', JSON.stringify(profil));
      },
      error: (error: any) => {
        console.error('❌ Erreur récupération profil utilisateur:', error);
        this.showAlert('❌ Erreur de connexion au serveur. Mode test activé.');
        this.modeTest = true;
        this.utiliserDonneesSimulees();
      }
    });
  }
}