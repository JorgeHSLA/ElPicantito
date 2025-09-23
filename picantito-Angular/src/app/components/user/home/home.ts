import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RecommendedProductCardComponent } from '../../shared/recommended-product-card/recommended-product-card.component';
import { FeatureCardComponent } from '../../shared/feature-card/feature-card.component';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RecommendedProductCardComponent, FeatureCardComponent],
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
      titulo: 'Preparación Rápida',
      descripcion: 'Tus tacos listos en minutos sin comprometer la calidad y el sabor tradicional.'
    },
    {
      icon: 'bi bi-heart-fill',
      titulo: 'Recetas Tradicionales',
      descripcion: 'Preparados con recetas familiares que mantienen el sabor auténtico mexicano.'
    }
  ];
  // Datos de productos recomendados
  productosRecomendados = [
    {
      id: 1,
      nombre: 'Taco al Pastor',
      descripcion: 'Taco tradicional de cerdo adobado con piña, cebolla y cilantro en tortilla de maíz.',
      precio: 1.40,
      imagen: 'https://lastaquerias.com/wp-content/uploads/2022/11/tacos-pastor-gaacc26fa8_1920.jpg',
      calificacion: 5
    },
    {
      id: 2,
      nombre: 'Taco de Carne Asada',
      descripcion: 'Carne de res asada a la parrilla con guacamole, cebolla y cilantro.',
      precio: 1.55,
      imagen: 'https://www.eatingonadime.com/wp-content/uploads/2024/03/carne-asada-1-square-1.jpg',
      calificacion: 5
    },
    {
      id: 3,
      nombre: 'Taco de Suadero',
      descripcion: 'Suaves trozos de suadero fritos en su jugo, servidos con salsa verde.',
      precio: 1.50,
      imagen: 'https://images.squarespace-cdn.com/content/v1/5a95f6d54611a0f9ec0a7f5e/1568912331542-701S75SMDWD3VQZI72OA/tacos-rey-del-suadero.jpg',
      calificacion: 5
    },
    {
      id: 4,
      nombre: 'Taco de Carnitas',
      descripcion: 'Cerdo cocido lentamente, servido con cebolla y cilantro.',
      precio: 1.40,
      imagen: 'https://okdiario.com/img/2022/04/30/tacos.jpg',
      calificacion: 5
    },
    {
      id: 5,
      nombre: 'Taco de Barbacoa',
      descripcion: 'Taco de barbacoa de borrego con salsa borracha.',
      precio: 1.70,
      imagen: 'https://images.squarespace-cdn.com/content/v1/56801b350e4c11744888ec37/1460472452918-SE8BPNUWMWCKTOPP1CHF/Lamb+Barbacoa+Tacos.jpg?format=1500w',
      calificacion: 5
    },
    {
      id: 6,
      nombre: 'Taco de Birria',
      descripcion: 'Taco de birria de res acompañado de consomé.',
      precio: 1.80,
      imagen: 'https://happyvegannie.com/wp-content/uploads/2023/09/birriatacos-1200x1200-2.jpg',
      calificacion: 5
    }
  ];

  // Estado del usuario (simulado por ahora)
  loggedUser: any = null; // Aquí integrarás con tu servicio de autenticación

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
    this.initializeCarousels();
  }

  private initializeBootstrapComponents(): void {
    // Inicializar tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  private initializeCarousels(): void {
    this.initializeMainCarousel();
    this.initializeRecommendedCarousel();
  }

  private initializeMainCarousel(): void {
    const mainCarousel = document.getElementById('promoCarousel');
    if (mainCarousel) {
      const carouselInstance = new bootstrap.Carousel(mainCarousel, {
        interval: 6000,
        wrap: true,
        touch: true,
        keyboard: true
      });

      // Efectos de hover para los botones de control
      const prevBtn = mainCarousel.querySelector('.carousel-control-prev');
      const nextBtn = mainCarousel.querySelector('.carousel-control-next');

      if (prevBtn && nextBtn) {
        const addClickEffect = (button: HTMLElement) => {
          button.style.transform = 'translateY(-50%) scale(0.9)';
          setTimeout(() => {
            button.style.transform = 'translateY(-50%) scale(1.1)';
            setTimeout(() => {
              button.style.transform = 'translateY(-50%) scale(1)';
            }, 100);
          }, 50);
        };

        prevBtn.addEventListener('click', () => addClickEffect(prevBtn as HTMLElement));
        nextBtn.addEventListener('click', () => addClickEffect(nextBtn as HTMLElement));

        // Pausar en hover
        mainCarousel.addEventListener('mouseenter', () => {
          carouselInstance.pause();
        });

        mainCarousel.addEventListener('mouseleave', () => {
          carouselInstance.cycle();
        });
      }
    }
  }

  private initializeRecommendedCarousel(): void {
    const carousel = document.getElementById('recommendedCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carousel || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const originalCards = Array.from(carousel.children);
    const totalCards = originalCards.length;

    const getVisibleCards = () => {
      if (window.innerWidth > 992) return 3;
      if (window.innerWidth > 768) return 2;
      return 1;
    };

    const setupInfiniteCarousel = () => {
      // Limpiar clones previos
      const clones = carousel.querySelectorAll('.clone');
      clones.forEach(clone => clone.remove());

      const visibleCards = getVisibleCards();

      // Clonar primeras al final
      for (let i = 0; i < visibleCards; i++) {
        const clone = originalCards[i].cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        carousel.appendChild(clone);
      }

      // Clonar últimas al inicio
      for (let i = totalCards - visibleCards; i < totalCards; i++) {
        const clone = originalCards[i].cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        carousel.insertBefore(clone, carousel.firstChild);
      }

      currentIndex = visibleCards;
      updateCarouselPosition(false);
    };

    const updateCarouselPosition = (animate = true) => {
      const cardWidth = (carousel.children[0] as HTMLElement).offsetWidth;
      const gap = parseFloat(window.getComputedStyle(carousel).gap) || 24;
      const translateX = currentIndex * (cardWidth + gap);

      if (animate) {
        carousel.classList.remove('no-transition');
      } else {
        carousel.classList.add('no-transition');
      }

      (carousel as HTMLElement).style.transform = `translateX(-${translateX}px)`;

      if (!animate) {
        setTimeout(() => {
          carousel.classList.remove('no-transition');
        }, 50);
      }
    };

    const checkInfiniteLoop = () => {
      const visibleCards = getVisibleCards();
      const totalWithClones = carousel.children.length;

      if (currentIndex >= totalWithClones - visibleCards) {
        currentIndex = visibleCards;
        updateCarouselPosition(false);
      } else if (currentIndex < visibleCards) {
        currentIndex = totalWithClones - visibleCards * 2;
        updateCarouselPosition(false);
      }
    };

    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateCarouselPosition(true);
      setTimeout(() => {
        checkInfiniteLoop();
      }, 500);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex--;
      updateCarouselPosition(true);
      setTimeout(() => {
        checkInfiniteLoop();
      }, 500);
    });

    window.addEventListener('resize', () => {
      setupInfiniteCarousel();
    });

    setupInfiniteCarousel();
  }

  // Métodos helper para las estrellas
  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  // Navegación
  navigateToProduct(productId: number): void {
    // Implementar navegación a producto
    console.log('Navegando a producto:', productId);
  }

  navigateToStore(): void {
    this.router.navigate(['/tienda']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }

  navigateToAbout(): void {
    this.router.navigate(['/sobre-nosotros']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}
