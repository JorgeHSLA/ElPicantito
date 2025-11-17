import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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



  constructor() {}

  getStarsArray(calificacion: number | undefined): any[] {
    const rating = calificacion || 0;
    return Array.from({ length: Math.round(rating) }, (_, i) => i);
  }

  getEmptyStarsArray(calificacion: number | undefined): any[] {
    const rating = calificacion || 0;
    return Array.from({ length: 5 - Math.round(rating) }, (_, i) => i);
  }





  onVerProducto() {
    this.verProducto.emit(this.producto.id);
  }
}
