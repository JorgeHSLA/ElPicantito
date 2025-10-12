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
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStarsArray(calificacion: number | undefined): any[] {
    const rating = calificacion || 0;
    return Array(5 - Math.round(rating)).fill(0);
  }





  onVerProducto() {
    this.verProducto.emit(this.producto.id);
  }
}
