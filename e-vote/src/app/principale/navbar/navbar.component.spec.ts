import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [],
      providers: [],
    }).overrideComponent(NavbarComponent, {
      set: {
        standalone: true,
        imports: [],
      },
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /perso on go("perso")', () => {
    component.go('perso');
    expect(navigateSpy).toHaveBeenCalledWith(['perso']);
  });

  it('should navigate to /principale on go("principale")', () => {
    component.go('principale');
    expect(navigateSpy).toHaveBeenCalledWith(['principale']);
  });

  it('should navigate to /vote on go("vote")', () => {
    component.go('vote');
    expect(navigateSpy).toHaveBeenCalledWith(['vote']);
  });

  it('should navigate to /conseils on go("conseils")', () => {
    component.go('conseils');
    expect(navigateSpy).toHaveBeenCalledWith(['conseils']);
  });
});
