import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamMemberCardComponent } from '../../shared/team-member-card/team-member-card.component';
import { ValueCardComponent } from '../../shared/value-card/value-card.component';
import { StoryCardComponent } from '../../shared/story-card/story-card.component';

declare var bootstrap: any;

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, TeamMemberCardComponent, ValueCardComponent, StoryCardComponent],
  templateUrl: './sobre-nosotros.html',
  styleUrls: ['./sobre-nosotros.css']
})
export class SobreNosotrosComponent implements OnInit, AfterViewInit {
  historias = [
    {
      imagen: 'https://cdn1.matadornetwork.com/blogs/2/2018/08/historia-del-taco-mexicano-shutterstock_405319411.jpg',
      alt: 'Viaje a México',
      titulo: 'El Viaje que lo Cambio Todo',
      descripcion: 'En 2019, durante un intercambio académico en México, descubrimos los auténticos sabores de la comida callejera mexicana. Cada taco era una explosión de sabores que jamás habíamos experimentado en Colombia.'
    },
    {
      imagen: 'https://hotelesb3.com/wp-content/uploads/2023/02/Gastronomia-Colombiana.jpg',
      alt: 'Pasión por cocinar',
      titulo: 'La Pasion por Compartir',
      descripcion: 'Al regresar a Colombia, nos dimos cuenta de que estos sabores auténticos no existían aquí. Decidimos aprender las técnicas tradicionales y traer esa experiencia gastronómica a nuestro país.'
    },
    {
      imagen: 'https://media.istockphoto.com/id/511773173/es/foto/profesor-ayudando-a-los-estudiantes-capacitaci%C3%B3n-para-trabajar-en-servicios-de-catering.jpg?s=612x612&w=0&k=20&c=iIQdObu13JPP-KgpN7a0yCnQ7qDq-Q9khOE_qrD2kHo=',
      alt: 'Aprendiendo de maestros',
      titulo: 'Aprendiendo de los Maestros',
      descripcion: 'Pasamos meses estudiando con cocineros tradicionales mexicanos, aprendiendo los secretos de las marinadas, las técnicas de cocción y la preparación artesanal de tortillas.'
    },
    {
      imagen: 'https://media-cdn.tripadvisor.com/media/photo-s/18/1a/33/b2/es-amplio-y-queda-frente.jpg',
      alt: 'Apertura del restaurante',
      titulo: 'El Nacimiento de El Picantito',
      descripcion: 'En 2023, abrimos las puertas de El Picantito con una misión clara: ofrecer auténticos tacos mexicanos en Colombia, manteniendo la tradición pero adaptándonos a los gustos locales.'
    }
  ];
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
