import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() producto: any;
  @Output() agregar = new EventEmitter<any>();
  @Output() verProducto = new EventEmitter<any>();

  getStarsArray(calificacion: number): any[] {
    return Array(Math.round(calificacion)).fill(0);
  }

  getEmptyStarsArray(calificacion: number): any[] {
    return Array(5 - Math.round(calificacion)).fill(0);
  }

  onAgregar(event: Event) {
    event.stopPropagation();
    this.agregar.emit(this.producto);
  }

  onVerProducto() {
    this.verProducto.emit(this.producto.id);
  }
}
