import { Component, OnInit, OnDestroy, signal, AfterViewInit, ElementRef } from '@angular/core';
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
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  totalProductos = signal(0);
  totalUsuarios = signal(0);
  totalAdicionales = signal(0);

  // Estadísticas
  estadisticas = signal<Estadisticas | null>(null);
  ventasPorDiaArray = signal<{ fecha: string; monto: number }[]>([]);
  maxVenta = signal(0);

  // Observer para animaciones
  private scrollObserver: IntersectionObserver | null = null;

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
    
    // Agregar clase al body para habilitar animaciones solo si JS está funcionando
    document.documentElement.classList.add('js-enabled');
  }

  ngAfterViewInit() {
    // Delay para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 150);
    
    // Fallback adicional por si el primero falla
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 300);
    
    // Fallback final: Mostrar todo si no se han animado después de 3 segundos
    setTimeout(() => {
      this.mostrarTodosLosElementos();
    }, 3000);
  }

  ngOnDestroy(): void {
    // Limpiar el observer para evitar memory leaks
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = null;
    }
    
    // Remover clase del documento
    document.documentElement.classList.remove('js-enabled');
  }

  private setupScrollAnimations() {
    // Desconectar observer anterior si existe
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');

    if (elements.length === 0) {
      console.log('No hay elementos con scroll-reveal para animar');
      return;
    }

    console.log(`Configurando animaciones para ${elements.length} elementos`);

    // Fallback: Si IntersectionObserver no está disponible, mostrar todo inmediatamente
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver no disponible, mostrando todos los elementos');
      elements.forEach((element: Element) => {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translateY(0)';
      });
      return;
    }

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const animation = element.dataset['animation'] || 'fadeInUp';
            
            // Obtener el delay del inline style si existe
            const inlineStyle = element.getAttribute('style');
            const delayMatch = inlineStyle?.match(/animation-delay:\s*([\d.]+)s/);
            const delay = delayMatch ? parseFloat(delayMatch[1]) * 1000 : 0;
            
            // Aplicar animación con el delay especificado
            setTimeout(() => {
              element.style.opacity = '1';
              element.classList.add('animate__animated', `animate__${animation}`);
            }, delay);
            
            this.scrollObserver?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    // Verificar cada elemento
    elements.forEach((element: Element, index: number) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Si ya está visible, animarlo inmediatamente con delay del inline style
        const inlineStyle = htmlElement.getAttribute('style');
        const delayMatch = inlineStyle?.match(/animation-delay:\s*([\d.]+)s/);
        const delay = delayMatch ? parseFloat(delayMatch[1]) * 1000 : index * 100;
        
        setTimeout(() => {
          const animation = htmlElement.dataset['animation'] || 'fadeInUp';
          htmlElement.style.opacity = '1';
          htmlElement.classList.add('animate__animated', `animate__${animation}`);
        }, delay);
      } else {
        // Si no está visible, observarlo
        this.scrollObserver?.observe(element);
      }
    });

    // Timeout de seguridad: Si después de 2 segundos hay elementos invisibles, mostrarlos
    setTimeout(() => {
      elements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.style.opacity === '0' || !htmlElement.style.opacity) {
          console.warn('Elemento todavía invisible, forzando visibilidad:', element);
          htmlElement.style.opacity = '1';
          htmlElement.style.transform = 'translateY(0)';
        }
      });
    }, 2000);
  }

  private mostrarTodosLosElementos(): void {
    const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      
      // Si el elemento está invisible o con opacidad muy baja
      if (parseFloat(computedStyle.opacity) < 0.5) {
        console.warn('Forzando visibilidad de elemento después del timeout final:', element);
        htmlElement.style.opacity = '1';
        htmlElement.style.transform = 'translateY(0)';
        htmlElement.classList.add('animate__animated', 'animate__fadeIn');
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
