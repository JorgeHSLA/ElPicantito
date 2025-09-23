import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamMemberCardComponent } from '../../shared/team-member-card/team-member-card.component';

declare var bootstrap: any;

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, TeamMemberCardComponent],
  templateUrl: './sobre-nosotros.html',
  styleUrls: ['./sobre-nosotros.css']
})
export class SobreNosotrosComponent implements OnInit, AfterViewInit {
  miembros = [
    {
      nombre: 'Javier Aldana',
      rol: 'Chef Principal',
      descripcion: 'Especialista en cocina mexicana tradicional con más de 10 años de experiencia. Aprendió las técnicas auténticas directamente en Oaxaca, México.',
      imagen: '/images/javier.jpg'
    },
    {
      nombre: 'Jorge Sierra',
      rol: 'Chef Secundario',
      descripcion: 'Especialista en cocina mexicana tradicional con alrededor de 5 años de experiencia. Aprendió técnicas culinarias mexicanas en varios cruceros de lujo en Cancún.',
      imagen: '/images/jorge.jpg'
    },
    {
      nombre: 'David Roa',
      rol: 'Fundador',
      descripcion: 'Ingeniero de sistemas convertido en emprendedor gastronómico. Su pasión por la comida mexicana lo llevó a crear El Picantito.',
      imagen: '/images/david.jpg'
    },
    {
      nombre: 'Juan Diego Muñoz',
      rol: 'Gerente General',
      descripcion: 'Administrador de empresas especializado en experiencia del cliente. Se encarga de que cada visita sea memorable. Es el genio detrás de todo. Crack total.',
      imagen: '/images/diego.jpg'
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
