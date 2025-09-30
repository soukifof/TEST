import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConseilsComponent } from './conseils.component';

describe('ConseilsComponent', () => {
  let component: ConseilsComponent;
  let fixture: ComponentFixture<ConseilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConseilsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConseilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in an h2 tag', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Page Conseils');
  });
});

