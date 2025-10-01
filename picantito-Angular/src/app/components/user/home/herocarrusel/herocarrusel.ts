import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

declare var bootstrap: any;

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
    this.initializeMainCarousel();
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

  navigateToStore(): void {
    this.router.navigate(['/tienda']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}