import { Component, effect, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CarritoService } from '../../../services/carrito.service';
import { SearchbarComponent } from '../searchbar/searchbar';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchbarComponent, CartSidebarComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = signal(false);
  isAdmin = signal(false);
  isOperador = signal(false);
  userName = signal('');
  userId = signal<number | null>(null);
  isScrolled = signal(false);
  cartItemCount = signal(0);

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {
    // Effect para reaccionar a cambios en el usuario logueado
    effect(() => {
      const user = this.authService.loggedUser();
      this.isLoggedIn.set(!!user);
      this.isAdmin.set(this.authService.isAdmin());
      this.isOperador.set(this.authService.isOperador());
      this.userName.set(user?.nombreUsuario?.toString() || '');
      this.userId.set(user?.id ?? null);
    });

    // Effect para reaccionar a cambios en el carrito
    effect(() => {
      this.cartItemCount.set(this.carritoService.getCantidadTotal());
    });
  }

  ngOnInit() {
    // Inicializar posición de scroll después de que la vista esté lista
    setTimeout(() => {
      this.checkScrollPosition();
    }, 100);
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const shouldBeScrolled = scrollPosition > 80;  // Aumenté el umbral para mejor efecto
    this.isScrolled.set(shouldBeScrolled);

    // Apply scroll classes to navbar
    const navbarContainer = document.querySelector('.floating-navbar-container');
    const navbar = document.querySelector('.navBarExtra');

    if (shouldBeScrolled) {
      navbarContainer?.classList.add('scrolled');
      navbar?.classList.add('scrolled');
    } else {
      navbarContainer?.classList.remove('scrolled');
      navbar?.classList.remove('scrolled');
    }
  }

  logout() {
    this.authService.logout();
    this.carritoService.limpiarCarritoCompleto();
    this.router.navigate(['/home']);
  }

  toggleCart() {
    this.carritoService.toggleCart();
  }

  // Método temporal para debugging - limpiar sistema completo
  debugLimpiarSistema() {
    console.log('🔧 DEBUG: Limpiando sistema completo desde navbar...');
    this.carritoService.limpiarTodoElSistema();
  }

  onNavItemClick(route: string, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      (event.currentTarget as HTMLElement)?.blur();
    }

    // Eliminar cualquier tooltip visible ANTES de navegar para evitar que quede "pegado"
    const tooltipTriggers = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')) as HTMLElement[];
    tooltipTriggers.forEach(el => {
      const Tooltip = (window as any).bootstrap?.Tooltip;
      if (Tooltip) {
        let instance = Tooltip.getInstance(el);
        if (instance) {
          instance.hide();
          // Forzar dispose para limpiar listeners y DOM
          instance.dispose();
        }
        // Asegurar que no queden tooltips huérfanos (atributos data-popper o role="tooltip")
        const orphan = document.querySelector('.tooltip');
        if (orphan && orphan.parentElement) {
          orphan.parentElement.removeChild(orphan);
        }
      }
      // Remover manualmente clase aria-describedby si quedó
      el.removeAttribute('aria-describedby');
    });

    // Cerrar menú móvil si abierto antes de navegar (evita animación mezclada)
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      const Collapse = (window as any).bootstrap?.Collapse;
      if (Collapse) {
        const collapseInstance = Collapse.getInstance(navbarCollapse) || new Collapse(navbarCollapse, { toggle: false });
        collapseInstance.hide();
      } else {
        navbarCollapse.classList.remove('show');
      }
    }

    // Navegar luego de un microtask para permitir DOM cleanup de tooltips
    setTimeout(() => {
      this.router.navigate([route]).then(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    }, 0);
  }

  goToMyOrders(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const id = this.userId();
    if (!id) {
      return;
    }
    this.onNavItemClick(`/cliente/${id}/pedidos`);
  }
}
