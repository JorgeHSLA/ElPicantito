import { Component, effect, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
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
  userName = signal('');
  cartItemCount = signal(0);

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    // Effect para reaccionar a cambios en el usuario logueado
    effect(() => {
      const user = this.authService.loggedUser();
      this.isLoggedIn.set(!!user);
      this.isAdmin.set(this.authService.isAdmin());
      this.userName.set(user?.nombreUsuario?.toString() || '');
    });

    // Effect para reaccionar a cambios en el carrito
    effect(() => {
      this.cartItemCount.set(this.cartService.getTotalItems());
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  toggleCart() {
    this.cartService.toggleCart();
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
}
