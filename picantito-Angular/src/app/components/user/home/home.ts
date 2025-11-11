import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card.component';
import { HerocarruselComponent } from './herocarrusel/herocarrusel';
import { MinisobreComponent } from './minisobre/minisobre';
import { RecomendadosComponent } from './recomendados/recomendados';
import { CreatacoComponent } from './creataco/creataco';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatureCardComponent, HerocarruselComponent, MinisobreComponent, RecomendadosComponent, CreatacoComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  features = [
    {
      icon: 'bi bi-award-fill',
      titulo: 'Ingredientes Frescos',
      descripcion: 'Seleccionamos los mejores ingredientes cada día para garantizar el sabor auténtico.'
    },
    {
      icon: 'bi bi-clock-fill',
      titulo: 'Preparacion Rapida',
      descripcion: 'Tus tacos listos en minutos sin comprometer la calidad y el sabor tradicional.'
    },
    {
      icon: 'bi bi-heart-fill',
      titulo: 'Recetas Tradicionales',
      descripcion: 'Preparados con recetas familiares que mantienen el sabor auténtico mexicano.'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Si el usuario ya está autenticado con JWT, redirigir según su rol
    if (this.authService.isLoggedIn()) {
      this.authService.redirectByRole();
    }
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
  }

  private initializeBootstrapComponents(): void {
    // Inicializar tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }



  navigateToStore(): void {
    this.router.navigate(['/tienda']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}
