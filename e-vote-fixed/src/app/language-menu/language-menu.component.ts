import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-menu',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="language-menu">
      <label for="lang-select">🌍 Langue :</label>
      <select id="lang-select" (change)="switchLang($event)">
        <option value="fr">Français</option>
        <option value="bm">Bambara</option>
      </select>
    </div>
  `,
  styles: [`
    .language-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    select {
      padding: 0.3rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `]
})
export class LanguageMenuComponent {
  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'fr';
    this.translate.use(savedLang);
  }

  switchLang(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
