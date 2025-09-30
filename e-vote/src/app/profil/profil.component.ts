import { Router } from '@angular/router';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  standalone: true,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfilComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  typeImport: 'profil' | null = null;

  photoProfil: string | ArrayBuffer | null = null;
  photoCarte: string | ArrayBuffer | null = null;

  infos: any = {};
  formulaireProfil: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    const stored = localStorage.getItem('infos');
    this.infos = stored ? JSON.parse(stored) : {};

    this.formulaireProfil = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]]
    });
  }

  retourAccueil(): void {
    this.router.navigate(['/register']);
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
        }
      };
      reader.readAsDataURL(file);
    }
  }

  allerprincipale(): void {
    const infosComplet = {
      ...this.infos,
      photoProfil: this.photoProfil,
      numero: this.formulaireProfil.get('numero')?.value
    };

    localStorage.setItem('infos', JSON.stringify(infosComplet));
    this.router.navigate(['/principale'], { state: { infos: infosComplet } });
  }
}
