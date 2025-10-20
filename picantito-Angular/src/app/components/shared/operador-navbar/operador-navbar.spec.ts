import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperadorNavbarComponent } from './operador-navbar.component';

describe('OperadorNavbarComponent', () => {
  let component: OperadorNavbarComponent;
  let fixture: ComponentFixture<OperadorNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadorNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadorNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
