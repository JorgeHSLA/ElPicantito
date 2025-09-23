import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sobre-nosotros.html',
  styleUrls: ['./sobre-nosotros.css']
})
export class SobreNosotrosComponent implements OnInit, AfterViewInit {
  

  // Estado del usuario (simulado por ahora)
  loggedUser: any = null; // Aquí integrarás con tu servicio de autenticación

  constructor() {}

  ngOnInit(): void {
    // Inicialización del componente
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

  // Navegación
  navigateToStore(): void {
    // Implementar navegación a tienda
    console.log('Navegando a tienda');
  }

  navigateToLocation(): void {
    // Implementar navegación a ubicación
    console.log('Navegando a ubicación');
  }
}
