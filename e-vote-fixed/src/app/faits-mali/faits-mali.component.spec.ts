import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaitsMaliComponent } from './faits-mali.component';

describe('FaitsMaliComponent', () => {
  let component: FaitsMaliComponent;
  let fixture: ComponentFixture<FaitsMaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaitsMaliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaitsMaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
