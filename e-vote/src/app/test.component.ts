import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from './services/backend.service'; // ← Chemin corrigé

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `<h1>{{ message }}</h1>`,
})
export class TestComponent implements OnInit {
  message = 'Chargement...';

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.backend.pingBackend().subscribe({
      next: (data: string) => this.message = '✅ Réponse du backend : ' + data,
      error: (err: any) => this.message = '❌ Erreur : ' + err.message
    });
  }
}
