import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SmsService } from '../services/sms.service';

@Component({
  standalone: true,
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [SmsService]
})
export class FavorisComponent {
  @Input() candidatChoisi: any = null;
  nomCandidat: string = '';
  formulaireVote: FormGroup;
  tentativesOtp: number = 0;
  maxTentatives: number = 3;
  otpEnvoye: boolean = false;
  otpGenere: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  photoCarte: string | ArrayBuffer | null = null;
  typeImport: 'carte' | null = null;
  afficherCarte: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private smsService: SmsService
  ) {
    this.formulaireVote = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(14)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^\+223\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/)
      ]],
      otpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      confirmation: [false, Validators.requiredTrue],
      photoCarte: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { candidatChoisi?: any };

    if (state?.candidatChoisi) {
      this.candidatChoisi = state.candidatChoisi;
      this.nomCandidat = this.candidatChoisi.nom;
    } else {
      console.warn('⚠️ Aucun candidat transmis à FavorisComponent');
    }
  }

  private genererOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  envoyerInfos(): void {
    if (this.formulaireVote.invalid) {
      this.formulaireVote.markAllAsTouched();
      alert('❌ Veuillez remplir tous les champs correctement.');
      return;
    }

    const { numero, email, telephone } = this.formulaireVote.value;
    const donnees = {
      nomCandidat: this.nomCandidat,
      numeroElecteur: numero,
      email,
      telephone
    };

    this.otpGenere = this.genererOtp();
    const message = `Bonjour, votre code OTP pour voter ${this.nomCandidat} est : ${this.otpGenere}`;

    console.log('📨 Données envoyées à l’administrateur :', donnees);
    console.log('📤 Simulation d’envoi du SMS à :', telephone, 'Message :', message);

    // Simulation sans API
    setTimeout(() => {
      console.log('✅ SMS simulé avec OTP :', this.otpGenere);
      alert('✅ SMS simulé avec succès.');
      this.otpEnvoye = true;
    }, 1000);

    // 👉 Si tu as une vraie API, décommente ceci :
    /*
    this.smsService.sendSms(telephone, message).subscribe({
      next: () => {
        alert('✅ SMS envoyé avec succès. Vérifiez votre téléphone.');
        this.otpEnvoye = true;
      },
      error: (err) => {
        console.error('❌ Erreur lors de l’envoi du SMS :', err);
        alert('❌ Échec de l’envoi du SMS. Réessayez plus tard.');
      }
    });
    */
  }

  validerVote(): void {
    const otp = this.formulaireVote.get('otpCode')?.value;

    if (otp !== this.otpGenere) {
      this.tentativesOtp++;
      if (this.tentativesOtp >= this.maxTentatives) {
        alert('🚫 Trop de tentatives. Veuillez réessayer plus tard.');
        return;
      }
      alert(`❌ Code OTP incorrect. Tentative ${this.tentativesOtp}/${this.maxTentatives}`);
      return;
    }

    alert(`✅ Vote confirmé pour ${this.nomCandidat} !`);
    this.router.navigate(['/confirmation'], {
      state: { nomCandidat: this.nomCandidat }
    });
  }

  retourAccueil(): void {
    this.router.navigate(['/vote']);
  }

  ouvrirGalerie(type: 'carte'): void {
    this.typeImport = type;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const isImage = file.type.startsWith('image/');
      const nomValide = file.name.toLowerCase().includes('carte') || file.name.toLowerCase().includes('id');

      if (!isImage || !nomValide) {
        alert('❌ Seules les photos de carte d’identité sont acceptées. Renommez le fichier avec "carte" ou "id".');
        this.formulaireVote.patchValue({ photoCarte: null });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Fichier trop volumineux. Maximum 5 Mo.');
        return;
      }

      this.formulaireVote.patchValue({ photoCarte: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.photoCarte = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
