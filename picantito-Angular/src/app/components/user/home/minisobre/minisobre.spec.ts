import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MinisobreComponent } from './minisobre';

describe('MinisobreComponent', () => {
  let component: MinisobreComponent;
  let fixture: ComponentFixture<MinisobreComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MinisobreComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinisobreComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to about page when navigateToAbout is called', () => {
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    
    component.navigateToAbout();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sobre-nosotros']);
  });
});