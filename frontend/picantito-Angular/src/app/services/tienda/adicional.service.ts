import { Injectable, signal } from '@angular/core';
import { Adicional } from '../../models/adicional';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {
  private adicionalesData = signal<Adicional[]>([
    {
      id: 1,
      nombre: 'Queso Extra',
      descripcion: 'Queso cheddar adicional',
      precio: 2.50,
      disponible: true
    },
    {
      id: 2,
      nombre: 'Aguacate',
      descripcion: 'Rebanadas de aguacate fresco',
      precio: 3.00,
      disponible: true
    },
    {
      id: 3,
      nombre: 'Jalapeños',
      descripcion: 'Jalapeños en escabeche',
      precio: 1.75,
      disponible: true
    },
    {
      id: 4,
      nombre: 'Salsa Picante',
      descripcion: 'Salsa picante casera',
      precio: 1.25,
      disponible: true
    }
  ]);

  getAdicionales() {
    return this.adicionalesData.asReadonly();
  }

  saveAdicional(adicional: Adicional) {
    const adicionales = this.adicionalesData();
    if (adicional.id) {
      // Actualizar
      const index = adicionales.findIndex(a => a.id === adicional.id);
      if (index !== -1) {
        adicionales[index] = adicional;
      }
    } else {
      // Crear nuevo
      adicional.id = Math.max(...adicionales.map(a => a.id || 0)) + 1;
      adicionales.push(adicional);
    }
    this.adicionalesData.set([...adicionales]);
  }

  deleteAdicional(id: number) {
    const adicionales = this.adicionalesData().filter(a => a.id !== id);
    this.adicionalesData.set(adicionales);
  }

  getAdicionalById(id: number) {
    return this.adicionalesData().find(a => a.id === id);
  }
}
