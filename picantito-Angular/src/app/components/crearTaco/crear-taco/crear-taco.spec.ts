import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTaco } from './crear-taco';

describe('CrearTaco', () => {
  let component: CrearTaco;
  let fixture: ComponentFixture<CrearTaco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTaco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTaco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
