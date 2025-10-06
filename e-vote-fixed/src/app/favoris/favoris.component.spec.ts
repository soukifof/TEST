import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavorisComponent } from './favoris.component';

describe('FavorisComponent', () => {
  let component: FavorisComponent;
  let fixture: ComponentFixture<FavorisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Comme FavorisComponent est standalone, on l'importe directement ici
      imports: [FavorisComponent]
    })
    .compileComponents();

    // Création de l'instance du composant
    fixture = TestBed.createComponent(FavorisComponent);
    component = fixture.componentInstance;

    // Déclenche le cycle de détection des changements Angular
    fixture.detectChanges();
  });

  it('should create', () => {
    // Vérifie que le composant est bien instancié
    expect(component).toBeTruthy();
  });
});
