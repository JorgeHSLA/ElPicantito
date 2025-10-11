import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() producto: Producto = {};
  @Output() agregar = new EventEmitter<any>();
  @Output() verProducto = new EventEmitter<any>();

  isAdding = signal(false);
  showLoginMessage = signal(false);

  constructor(private cartService: CartService, private router: Router) {}

  getStarsArray(calificacion: number | undefined): any[] {
    const rating = calificacion || 0;
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarsArray(calificacion: number | undefined): any[] {
    const rating = calificacion || 0;
    return Array(5 - Math.round(rating)).fill(0);
  }

  onAgregar(event: Event) {
    event.stopPropagation();

    if (this.producto.id && this.producto.disponible) {
      this.isAdding.set(true);

      // Intentar agregar al carrito
      const added = this.cartService.addToCart(this.producto, 1);

      if (added) {
        // Si se agregó exitosamente, emitir evento
        this.agregar.emit(this.producto);

        // Mostrar feedback visual por un momento
        setTimeout(() => {
          this.isAdding.set(false);
        }, 800);
      } else {
        // Si no se pudo agregar (usuario no autenticado), mostrar mensaje
        this.isAdding.set(false);
        this.showLoginMessage.set(true);

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          this.showLoginMessage.set(false);
        }, 3000);
      }
    }
  }

  // Método para redirigir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  onVerProducto() {
    this.verProducto.emit(this.producto.id);
  }
}
