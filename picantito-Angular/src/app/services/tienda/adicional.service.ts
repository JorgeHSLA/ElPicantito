import { Injectable } from '@angular/core';
import { Adicional } from '../../models/adicional';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {
  
  private readonly STORAGE_KEY = 'adicionales_picantito';

  // Mover arriba para que exista antes de loadFromStorage
  private adicionalesIniciales: Adicional[] = [
    { id: 1, nombre: 'Queso Extra', descripcion: 'Queso cheddar adicional', precio: 2.50, disponible: true },
    { id: 2, nombre: 'Aguacate', descripcion: 'Rebanadas de aguacate fresco', precio: 3.00, disponible: true },
    { id: 3, nombre: 'Jalapeños', descripcion: 'Jalapeños en escabeche', precio: 1.75, disponible: true },
    { id: 4, nombre: 'Salsa Picante', descripcion: 'Salsa picante casera', precio: 1.25, disponible: true },
    { id: 5, nombre: 'Cebolla Caramelizada', descripcion: 'Cebolla caramelizada al sartén', precio: 1.50, disponible: false }
  ];

  private adicionales: Adicional[] = this.loadFromStorage();

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.adicionales = [...this.adicionalesIniciales];
      this.saveToStorage(this.adicionales);
    }
  }

  private loadFromStorage(): Adicional[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [...this.adicionalesIniciales];
    } catch (error) {
      console.error('Error loading adicionales from storage', error);
      return [...this.adicionalesIniciales];
    }
  }

  private saveToStorage(data: Adicional[]): void {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch (error) {
      console.error('Error saving adicionales to storage', error);
    }
  }

  // obtener lista
  getAdicionales(): Adicional[] {
    return [...this.adicionales];
  }

  // crear
  saveAdicional(adicional: Adicional) {
    const nuevoId = this.adicionales.length > 0 ? Math.max(...this.adicionales.map(a => a.id ?? 0)) + 1 : 1;
    this.adicionales.push({ ...adicional, id: nuevoId });
    this.saveToStorage(this.adicionales);
  }

  // actualizar
  updateAdicional(id: number, adicional: Adicional) {
    const index = this.adicionales.findIndex(a => a.id === id);
    if (index !== -1) {
      this.adicionales[index] = { ...adicional, id };
      this.saveToStorage(this.adicionales);
    }
  }

  // eliminar
  deleteAdicional(id: number) {
    this.adicionales = this.adicionales.filter(a => a.id !== id);
    this.saveToStorage(this.adicionales);
  }

  resetToInitialData() {
    this.adicionales = [...this.adicionalesIniciales];
    this.saveToStorage(this.adicionales);
  }
}
