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
  
  // Datos del equipo
  equipoMiembros = [
    {
      id: 1,
      nombre: 'Javier Aldana',
      cargo: 'Chef Principal',
      imagen: 'assets/images/javier.jpg',
      descripcion: 'Especialista en cocina mexicana tradicional con más de 10 años de experiencia. Aprendió las técnicas auténticas directamente en Oaxaca, México.'
    },
    {
      id: 2,
      nombre: 'Jorge Sierra',
      cargo: 'Chef Secundario',
      imagen: 'assets/images/jorge.jpg',
      descripcion: 'Especialista en cocina mexicana tradicional con alrededor de 5 años de experiencia. Aprendió técnicas culinarias mexicanas en varios cruceros de lujo en Cancún.'
    },
    {
      id: 3,
      nombre: 'David Roa',
      cargo: 'Fundador',
      imagen: 'assets/images/david.jpg',
      descripcion: 'Ingeniero de sistemas convertido en emprendedor gastronómico. Su pasión por la comida mexicana lo llevó a crear El Picantito.'
    },
    {
      id: 4,
      nombre: 'Juan Diego Muñoz',
      cargo: 'Gerente General',
      imagen: 'assets/images/diego.jpg',
      descripcion: 'Administrador de empresas especializado en experiencia del cliente. Se encarga de que cada visita sea memorable. Es el genio detrás de todo. Crack total.'
    }
  ];

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
