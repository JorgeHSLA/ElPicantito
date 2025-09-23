import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamMemberCardComponent } from '../../shared/team-member-card/team-member-card.component';
import { ValueCardComponent } from '../../shared/value-card/value-card.component';

declare var bootstrap: any;

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, TeamMemberCardComponent, ValueCardComponent],
  templateUrl: './sobre-nosotros.html',
  styleUrls: ['./sobre-nosotros.css']
})
export class SobreNosotrosComponent implements OnInit, AfterViewInit {
  valores = [
    {
      icon: 'bi bi-award-fill',
      titulo: 'Autenticidad',
      descripcion: 'Respetamos las recetas tradicionales y utilizamos técnicas auténticas transmitidas por generaciones de cocineros mexicanos.'
    },
    {
      icon: 'bi bi-patch-check-fill',
      titulo: 'Ingredientes Frescos',
      descripcion: 'Seleccionamos cuidadosamente cada ingrediente, priorizando la frescura y la calidad por encima de todo.'
    },
    {
      icon: 'bi bi-people-fill',
      titulo: 'Comunidad',
      descripcion: 'Creemos en crear conexiones genuinas con nuestros clientes y en ser parte activa de la comunidad local.'
    }
  ];
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
