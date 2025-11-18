import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-herocarrusel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './herocarrusel.html',
  styleUrls: ['./herocarrusel.css']
})
export class HerocarruselComponent implements OnInit, AfterViewInit {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialización del componente
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMainCarousel();
    }, 200);
  }

  private initializeMainCarousel(): void {
    const carousel = document.getElementById('heroCarouselInner');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');

    if (!carousel || !prevBtn || !nextBtn) {
      console.warn('Elementos del carrusel hero no encontrados');
      return;
    }

    const items = Array.from(carousel.children).filter(child =>
      !child.classList.contains('clone')
    ) as HTMLElement[];

    if (items.length === 0) {
      console.warn('No hay items en el carrusel hero');
      return;
    }

    let currentIndex = 0;
    let autoPlayInterval: any;

    const setupCarousel = () => {
      // Limpiar todos los event listeners anteriores clonando los botones
      const newPrevBtn = prevBtn.cloneNode(true) as HTMLElement;
      const newNextBtn = nextBtn.cloneNode(true) as HTMLElement;
      prevBtn.replaceWith(newPrevBtn);
      nextBtn.replaceWith(newNextBtn);

      // Limpiar clones existentes
      carousel.querySelectorAll('.clone').forEach(clone => clone.remove());

      // Clonar el primer item al final para el efecto infinito
      const firstClone = items[0].cloneNode(true) as HTMLElement;
      firstClone.classList.add('clone');
      carousel.appendChild(firstClone);

      // Clonar el último item al inicio
      const lastClone = items[items.length - 1].cloneNode(true) as HTMLElement;
      lastClone.classList.add('clone');
      carousel.insertBefore(lastClone, carousel.firstChild);

      currentIndex = 1; // Empezar en el primer item real (después del clon)
      updatePosition(false);

      // Agregar event listeners a los nuevos botones
      newNextBtn.addEventListener('click', () => {
        moveCarousel(1);
        resetAutoPlay();
      });
      
      newPrevBtn.addEventListener('click', () => {
        moveCarousel(-1);
        resetAutoPlay();
      });

      // Pausar en hover
      carousel.addEventListener('mouseenter', () => {
        stopAutoPlay();
      });

      carousel.addEventListener('mouseleave', () => {
        startAutoPlay();
      });

      // Iniciar autoplay
      startAutoPlay();
    };

    const updatePosition = (animate = true) => {
      const itemWidth = carousel.offsetWidth;
      const offset = currentIndex * itemWidth;

      carousel.classList.toggle('no-transition', !animate);
      (carousel as HTMLElement).style.transform = `translateX(-${offset}px)`;

      if (!animate) {
        setTimeout(() => carousel.classList.remove('no-transition'), 50);
      }
    };

    const moveCarousel = (direction: number) => {
      const totalWithClones = carousel.children.length;

      currentIndex += direction;
      updatePosition(true);

      setTimeout(() => {
        // Loop infinito: si llegamos al final, volver al inicio real
        if (currentIndex >= totalWithClones - 1) {
          currentIndex = 1;
          updatePosition(false);
        }
        // Si vamos antes del inicio, ir al final real
        else if (currentIndex <= 0) {
          currentIndex = items.length;
          updatePosition(false);
        }
      }, 500);
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(() => {
        moveCarousel(1);
      }, 5000);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
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

  navigateToStore(): void {
    this.router.navigate(['/tienda']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}