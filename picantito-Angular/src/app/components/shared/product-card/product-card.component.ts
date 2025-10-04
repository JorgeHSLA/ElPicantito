import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private cartService: CartService) {}

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
      
      // Agregar al carrito usando el servicio
      this.cartService.addToCart(this.producto, 1);
      
      // Emitir evento para compatibilidad con otros componentes
      this.agregar.emit(this.producto);
      
      // Mostrar feedback visual por un momento
      setTimeout(() => {
        this.isAdding.set(false);
      }, 800);
    }
  }

  onVerProducto() {
    this.verProducto.emit(this.producto.id);
  }
}
