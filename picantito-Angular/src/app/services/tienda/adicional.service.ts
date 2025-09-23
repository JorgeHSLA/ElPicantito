import { Injectable } from '@angular/core';
import { Adicional } from '../../models/adicional';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {
  
  private adicionales: Adicional[] = [
    { id: 1, nombre: 'Queso Extra', descripcion: 'Queso cheddar adicional', precio: 2.50, disponible: true },
    { id: 2, nombre: 'Aguacate', descripcion: 'Rebanadas de aguacate fresco', precio: 3.00, disponible: true },
    { id: 3, nombre: 'Jalapeños', descripcion: 'Jalapeños en escabeche', precio: 1.75, disponible: true },
    { id: 4, nombre: 'Salsa Picante', descripcion: 'Salsa picante casera', precio: 1.25, disponible: true },
    { id: 5, nombre: 'Cebolla Caramelizada', descripcion: 'Cebolla caramelizada al sartén', precio: 1.50, disponible: false }
  ];

  // obtener lista
  getAdicionales(): Adicional[] {
    return [...this.adicionales]; // retorno copia para no mutar directamente
  }

  // crear
  saveAdicional(adicional: Adicional) {
    const nuevoId = this.adicionales.length > 0 ? Math.max(...this.adicionales.map(a => a.id ?? 0)) + 1 : 1;
    this.adicionales.push({ ...adicional, id: nuevoId });
  }

  // actualizar
  updateAdicional(id: number, adicional: Adicional) {
    const index = this.adicionales.findIndex(a => a.id === id);
    if (index !== -1) {
      this.adicionales[index] = { ...adicional, id };
    }
  }

  // eliminar
  deleteAdicional(id: number) {
    this.adicionales = this.adicionales.filter(a => a.id !== id);
  }
}
