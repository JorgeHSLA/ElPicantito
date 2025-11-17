import { Component, OnInit, signal, AfterViewInit, ElementRef } from '@angular/core';
import { ProductoService } from '../../../services/tienda/producto.service';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { AuthService } from '../../../services/auth.service';
import { EstadisticasService, Estadisticas } from '../../../services/estadisticas.service';
import { Usuario } from '../../../models/usuario';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, AdminSidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  totalProductos = signal(0);
  totalUsuarios = signal(0);
  totalAdicionales = signal(0);

  // Estadísticas
  estadisticas = signal<Estadisticas | null>(null);
  ventasPorDiaArray = signal<{ fecha: string; monto: number }[]>([]);
  maxVenta = signal(0);

  // Productos y Adicionales con nombres
  productosMap = signal<Map<number, string>>(new Map());
  adicionalesMap = signal<Map<number, string>>(new Map());
  clientesMap = signal<Map<number, Usuario>>(new Map());

  constructor(
    private productoService: ProductoService,
    private adicionalService: AdicionalService,
    private authService: AuthService,
    private estadisticasService: EstadisticasService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.cargarDatosBasicos();
    this.cargarEstadisticas();
    this.cargarProductosYAdicionales();
    this.cargarClientes();
  }

  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 100);
  }

  private setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.05, // Reduce el threshold para activar antes
      rootMargin: '50px 0px -50px 0px' // Activa cuando el elemento está cerca del viewport
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

    // Observar todos los elementos con la clase scroll-reveal
    const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element) => {
      // Forzar el check inicial para elementos ya visibles
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Si el elemento ya está visible, animarlo inmediatamente
        setTimeout(() => {
          el.classList.add('animate__animated');
          const animationType = el.getAttribute('data-animation') || 'animate__fadeInUp';
          el.classList.add(animationType);
        }, 50);
      } else {
        // Si no está visible, observarlo para cuando aparezca
        observer.observe(el);
      }
    });
  }

  private cargarDatosBasicos() {
    // Productos
    this.productoService.getAllProductos().subscribe(productos => {
      this.totalProductos.set(productos.length);
    });
    // Adicionales
    this.adicionalService.getAllAdicionales().subscribe(adicionales => {
      this.totalAdicionales.set(adicionales.length);
    });
    // Usuarios
    this.authService.getAllUsuarios().subscribe(usuarios => {
      this.totalUsuarios.set(usuarios.length);
    });
  }

  private cargarEstadisticas() {
    this.estadisticasService.obtenerEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas.set(stats);

        // Procesar ventas por día para la gráfica
        const ventasArray = Object.entries(stats.ventasPorDia)
          .map(([fecha, monto]) => ({ fecha, monto }))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(-30); // Últimos 30 días

        this.ventasPorDiaArray.set(ventasArray);
        this.maxVenta.set(Math.max(...ventasArray.map(v => v.monto)));
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
      }
    });
  }

  private cargarProductosYAdicionales() {
    // Cargar productos para mapear IDs a nombres
    this.productoService.getAllProductos().subscribe(productos => {
      const map = new Map<number, string>();
      productos.forEach(p => {
        if (p.id) map.set(p.id, p.nombre || 'Sin nombre');
      });
      this.productosMap.set(map);
    });

    // Cargar adicionales para mapear IDs a nombres
    this.adicionalService.getAllAdicionales().subscribe(adicionales => {
      const map = new Map<number, string>();
      adicionales.forEach(a => {
        if (a.id) map.set(a.id, a.nombre || 'Sin nombre');
      });
      this.adicionalesMap.set(map);
    });
  }

  private cargarClientes() {
    this.authService.obtenerUsuariosPorRol('CLIENTE').subscribe(clientes => {
      const map = new Map<number, Usuario>();
      clientes.forEach(c => {
        if (c.id) map.set(c.id, c);
      });
      this.clientesMap.set(map);
    });
  }

  obtenerNombreProducto(id: number): string {
    return this.productosMap().get(id) || `Producto #${id}`;
  }

  obtenerNombreAdicional(id: number): string {
    return this.adicionalesMap().get(id) || `Adicional #${id}`;
  }

  obtenerNombreCliente(id: number): string {
    const cliente = this.clientesMap().get(id);
    return cliente?.nombreCompleto || `Cliente #${id}`;
  }

  obtenerTelefonoCliente(id: number): string {
    const cliente = this.clientesMap().get(id);
    return cliente?.telefono || 'Sin teléfono';
  }

  obtenerCorreoCliente(id: number): string {
    const cliente = this.clientesMap().get(id);
    return cliente?.correo || 'Sin correo';
  }

  calcularAlturaBarra(monto: number): number {
    const max = this.maxVenta();
    return max > 0 ? (monto / max) * 100 : 0;
  }

  obtenerEtiquetasEjeY(): string[] {
    const max = this.maxVenta();
    if (max === 0) return ['$0'];

    const etiquetas: string[] = [];
    const numEtiquetas = 5;

    for (let i = numEtiquetas; i >= 0; i--) {
      const valor = (max / numEtiquetas) * i;
      etiquetas.push(this.formatearMoneda(valor));
    }

    return etiquetas;
  }

  formatearFecha(fecha: string): string {
    // Extraer día y mes directamente del string para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('-');
    return `${parseInt(day)}/${parseInt(month)}`;
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  }
}
