import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecommendedProductCardComponent } from '../../../shared/recommended-product-card/recommended-product-card.component';
import { ProductoService } from '../../../../services/tienda/producto.service';
import { Producto } from '../../../../models/producto';

@Component({
  selector: 'app-recomendados',
  standalone: true,
  imports: [CommonModule, RecommendedProductCardComponent],
  templateUrl: './recomendados.html',
  styleUrls: ['./recomendados.css']
})
export class RecomendadosComponent implements OnInit, AfterViewInit {

  productosRecomendados: Producto[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarProductosRecomendados();
  }

  ngAfterViewInit(): void {
    // El carrusel se inicializará después de cargar los productos
  }

  private cargarProductosRecomendados(): void {
    this.productoService.getProductosActivos().subscribe({
      next: (productos) => {
        // Tomar los primeros 6 productos activos como recomendados
        this.productosRecomendados = productos.slice(0, 6).map(producto => ({
          ...producto,
          // Asegurar compatibilidad con el componente de card
          precio: producto.precioDeVenta || producto.precio || 0,
          imagen: producto.imagen || '/images/default-taco.jpg'
        }));
        this.isLoading = false;

        // Inicializar el carrusel después de que los productos se hayan renderizado
        setTimeout(() => {
          this.initializeRecommendedCarousel();
        }, 200);
      },
      error: (error) => {
        console.error('Error al cargar productos recomendados:', error);
        this.isLoading = false;
        // Si hay error, mostrar array vacío
        this.productosRecomendados = [];
      }
    });
  }

  private initializeRecommendedCarousel(): void {
    const carousel = document.getElementById('recommendedCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carousel || !prevBtn || !nextBtn) {
      console.warn('Elementos del carrusel no encontrados');
      return;
    }

    const cards = Array.from(carousel.children).filter(child =>
      !child.classList.contains('clone')
    ) as HTMLElement[];

    if (cards.length === 0) {
      console.warn('No hay productos para mostrar en el carrusel');
      return;
    }

    let currentIndex = 0;

    const getVisibleCards = () => {
      if (window.innerWidth > 992) return 3;
      if (window.innerWidth > 768) return 2;
      return 1;
    };

    const setupCarousel = () => {
      // Limpiar todos los event listeners anteriores clonando los botones
      const newPrevBtn = prevBtn.cloneNode(true) as HTMLElement;
      const newNextBtn = nextBtn.cloneNode(true) as HTMLElement;
      prevBtn.replaceWith(newPrevBtn);
      nextBtn.replaceWith(newNextBtn);

      // Limpiar clones existentes
      carousel.querySelectorAll('.clone').forEach(clone => clone.remove());

      const visibleCards = getVisibleCards();

      // Clonar las primeras cards al final para el efecto infinito
      cards.slice(0, visibleCards).forEach(card => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        carousel.appendChild(clone);
      });

      // Clonar las últimas cards al inicio
      cards.slice(-visibleCards).forEach(card => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.classList.add('clone');
        carousel.insertBefore(clone, carousel.firstChild);
      });

      currentIndex = visibleCards;
      updatePosition(false);

      // Agregar event listeners a los nuevos botones
      newNextBtn.addEventListener('click', () => moveCarousel(1));
      newPrevBtn.addEventListener('click', () => moveCarousel(-1));
    };

    const updatePosition = (animate = true) => {
      const firstCard = carousel.children[0] as HTMLElement;
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = parseFloat(window.getComputedStyle(carousel).gap) || 24;
      const offset = currentIndex * (cardWidth + gap);

      carousel.classList.toggle('no-transition', !animate);
      (carousel as HTMLElement).style.transform = `translateX(-${offset}px)`;

      if (!animate) {
        setTimeout(() => carousel.classList.remove('no-transition'), 50);
      }
    };

    const moveCarousel = (direction: number) => {
      const visibleCards = getVisibleCards();
      const totalWithClones = carousel.children.length;

      currentIndex += direction;
      updatePosition(true);

      setTimeout(() => {
        // Loop infinito: si llegamos al final, volver al inicio real
        if (currentIndex >= totalWithClones - visibleCards) {
          currentIndex = visibleCards;
          updatePosition(false);
        }
        // Si vamos antes del inicio, ir al final real
        else if (currentIndex < visibleCards) {
          currentIndex = cards.length + visibleCards - 1;
          updatePosition(false);
        }
      }, 350);
    };

    let resizeTimeout: any;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupCarousel();
      }, 250);
    });

    setupCarousel();
  }

  navigateToProduct(productId: number | undefined): void {
    if (!productId) {
      console.error('ID de producto no válido');
      return;
    }
    this.router.navigate(['/producto', productId]).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }

  navigateToStore(): void {
    this.router.navigate(['/tienda']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}
