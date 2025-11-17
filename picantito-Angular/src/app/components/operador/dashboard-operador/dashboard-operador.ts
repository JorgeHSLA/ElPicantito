import { Component, OnInit, inject, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionPedidosService } from '../../../services/gestion-pedidos.service';
import { RepartidorService } from '../../../services/repartidor.service';
import { PedidoCompleto } from '../../../models/pedido-completo';
import { Repartidor } from '../../../models/repartidor';
import { OperadorNavbarComponent } from '../../shared/operador-navbar/operador-navbar.component';
import { OperadorSidebarComponent } from '../../shared/operador-sidebar/operador-sidebar.component';

@Component({
  selector: 'app-dashboard-operador',
  imports: [CommonModule, OperadorNavbarComponent, OperadorSidebarComponent],
  templateUrl: './dashboard-operador.html',
  styleUrl: './dashboard-operador.css'
})
export class DashboardOperador implements OnInit, AfterViewInit {
  private gestionPedidosService = inject(GestionPedidosService);
  private repartidorService = inject(RepartidorService);
  private elementRef = inject(ElementRef);

  pedidos: PedidoCompleto[] = [];
  repartidores: Repartidor[] = [];
  estadisticas = {
    recibidos: 0,
    cocinando: 0,
    enviados: 0,
    entregados: 0,
    total: 0,
    repartidoresDisponibles: 0
  };

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 100);
  }

  private setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated');
          const animationType = entry.target.getAttribute('data-animation') || 'animate__fadeInUp';
          entry.target.classList.add(animationType);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element, index: number) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        setTimeout(() => {
          el.classList.add('animate__animated');
          const animationType = el.getAttribute('data-animation') || 'animate__fadeInUp';
          el.classList.add(animationType);
        }, index * 100);
      } else {
        observer.observe(el);
      }
    });
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = null;

    // Cargar pedidos
    this.gestionPedidosService.getAllPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.calcularEstadisticas();
        this.loading = false;
        // Inicializar animaciones después de cargar
        setTimeout(() => {
          this.setupScrollAnimations();
        }, 150);
      },
      error: (err) => {
        this.error = 'Error al cargar las estadísticas';
        console.error('Error:', err);
        this.loading = false;
      }
    });

    // Cargar todos los repartidores
    this.repartidorService.getRepartidores().subscribe({
      next: (repartidores) => {
        this.repartidores = repartidores;
        this.estadisticas.repartidoresDisponibles = repartidores.filter(
          r => r.estado === 'DISPONIBLE'
        ).length;
      },
      error: (err) => {
        console.error('Error al cargar repartidores:', err);
      }
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.recibidos = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'recibido'
    ).length;

    this.estadisticas.cocinando = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'cocinando'
    ).length;

    this.estadisticas.enviados = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'enviado'
    ).length;

    this.estadisticas.entregados = this.pedidos.filter(
      p => p.estado.toLowerCase() === 'entregado'
    ).length;

    this.estadisticas.total = this.pedidos.length;
  }
}
