import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, signal } from '@angular/core';
import { Item } from '../../../models/crearTaco/item';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { ProductoService } from '../../../services/tienda/producto.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-drag-and-drop',
  imports: [CommonModule, CdkDropList, CdkDrag],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.css'
})
export class DragAndDrop {

  // Usando signals para estado reactivo
  todo = signal<Item[]>([]);
  done = signal<Item[]>([]);
  currentStep = signal<string>('tortilla');
  totalPrice = signal<number>(0);
  canGoToNextStep = signal<boolean>(false);

  // Categorías de ingredientes
  private tortillas: Item[] = [
    { idAdcional: 1, nombre: 'Tortilla de Maíz', image: '/images/crearTaco/tortillas/maiz.jpg', precio: 5, cantidad: 1 },
    { idAdcional: 2, nombre: 'Tortilla de Harina', image: '/images/crearTaco/tortillas/harina.jpg', precio: 6, cantidad: 1 },
    { idAdcional: 3, nombre: 'Tortilla Integral', image: '/images/crearTaco/tortillas/integral.jpg', precio: 7, cantidad: 1 }
  ];

  private proteinas: Item[] = [
    { idAdcional: 4, nombre: 'Carne Asada', image: '/images/crearTaco/proteinas/carne-asada.jpg', precio: 25, cantidad: 1 },
    { idAdcional: 5, nombre: 'Pollo', image: '/images/crearTaco/proteinas/pollo.jpg', precio: 20, cantidad: 1 },
    { idAdcional: 6, nombre: 'Pastor', image: '/images/crearTaco/proteinas/pastor.jpg', precio: 22, cantidad: 1 },
    { idAdcional: 7, nombre: 'Carnitas', image: '/images/crearTaco/proteinas/carnitas.jpg', precio: 23, cantidad: 1 },
    { idAdcional: 8, nombre: 'Chorizo', image: '/images/crearTaco/proteinas/chorizo.jpg', precio: 21, cantidad: 1 }
  ];

  private salsas: Item[] = [
    { idAdcional: 9, nombre: 'Salsa Verde', image: '/images/crearTaco/salsas/verde.jpg', precio: 3, cantidad: 1 },
    { idAdcional: 10, nombre: 'Salsa Roja', image: '/images/crearTaco/salsas/roja.jpg', precio: 3, cantidad: 1 },
    { idAdcional: 11, nombre: 'Salsa Habanera', image: '/images/crearTaco/salsas/habanera.jpg', precio: 4, cantidad: 1 },
    { idAdcional: 12, nombre: 'Salsa Chipotle', image: '/images/crearTaco/salsas/chipotle.jpg', precio: 4, cantidad: 1 },
    { idAdcional: 13, nombre: 'Pico de Gallo', image: '/images/crearTaco/salsas/pico-gallo.jpg', precio: 5, cantidad: 1 }
  ];

  private extras: Item[] = [
    { idAdcional: 14, nombre: 'Queso Oaxaca', image: '/images/crearTaco/quesos/oaxaca.jpg', precio: 8, cantidad: 1 },
    { idAdcional: 15, nombre: 'Queso Cotija', image: '/images/crearTaco/quesos/cotija.jpg', precio: 7, cantidad: 1 },
    { idAdcional: 16, nombre: 'Lechuga', image: '/images/crearTaco/vegetales/lechuga.jpg', precio: 2, cantidad: 1 }
  ];

  constructor(
    private productoService: ProductoService,
    private adicionalService: AdicionalService,

  ) {}


  ngOnInit() {
    // Inicializar con tortillas
    this.loadCategoryItems('tortilla');
    this.done.set([]);
  }

  private loadCategoryItems(category: string) {
    const doneItems = this.done();
    let availableItems: Item[] = [];

    switch(category) {
      case 'tortilla':
        // Para tortillas, mostrar todas MENOS la que está actualmente en done
        const currentTortillaInDone = doneItems.find(
          item => item.idAdcional! >= 1 && item.idAdcional! <= 3
        );
        
        availableItems = this.tortillas.filter(
          tortilla => tortilla.idAdcional !== currentTortillaInDone?.idAdcional
        );
        break;
      case 'proteína':
        // Para proteínas, mostrar todas MENOS las que ya están en done
        const doneProteinIds = doneItems
          .filter(item => item.idAdcional! >= 4 && item.idAdcional! <= 8)
          .map(item => item.idAdcional);
        
        availableItems = this.proteinas.filter(
          proteina => !doneProteinIds.includes(proteina.idAdcional)
        );
        break;
      case 'salsa':
        // Para salsas, mostrar todas MENOS las que ya están en done
        const doneSalsaIds = doneItems
          .filter(item => item.idAdcional! >= 9 && item.idAdcional! <= 13)
          .map(item => item.idAdcional);
        
        availableItems = this.salsas.filter(
          salsa => !doneSalsaIds.includes(salsa.idAdcional)
        );
        break;
      case 'extras':
        // Para extras, mostrar todas MENOS las que ya están en done
        const doneExtraIds = doneItems
          .filter(item => item.idAdcional! >= 14 && item.idAdcional! <= 16)
          .map(item => item.idAdcional);
        
        availableItems = this.extras.filter(
          extra => !doneExtraIds.includes(extra.idAdcional)
        );
        break;
    }

    this.todo.set(availableItems);
    this.currentStep.set(category);
  }

  private updateCanGoToNextStep() {
    const doneItems = this.done();
    const currentStepValue = this.currentStep();
    
    if (currentStepValue === 'tortilla') {
      // Debe tener al menos una tortilla
      this.canGoToNextStep.set(
        doneItems.some(item => item.idAdcional! >= 1 && item.idAdcional! <= 3)
      );
    } else if (currentStepValue === 'proteína') {
      // Debe tener al menos una proteína
      this.canGoToNextStep.set(
        doneItems.some(item => item.idAdcional! >= 4 && item.idAdcional! <= 8)
      );
    } else {
      // Salsas y extras son opcionales
      this.canGoToNextStep.set(true);
    }
  }

  goToNextStep() {
    const currentStepValue = this.currentStep();
    
    if (currentStepValue === 'tortilla') {
      this.loadCategoryItems('proteína');
    } else if (currentStepValue === 'proteína') {
      this.loadCategoryItems('salsa');
    } else if (currentStepValue === 'salsa') {
      this.loadCategoryItems('extras');
    }
    
    this.updateCanGoToNextStep();
  }

  goToPreviousStep() {
    const currentStepValue = this.currentStep();
    
    if (currentStepValue === 'proteína') {
      this.loadCategoryItems('tortilla');
    } else if (currentStepValue === 'salsa') {
      this.loadCategoryItems('proteína');
    } else if (currentStepValue === 'extras') {
      this.loadCategoryItems('salsa');
    }
    
    this.updateCanGoToNextStep();
  }

  private calculateTotalPrice() {
    const doneItems = this.done();
    const total = doneItems.reduce((sum, item) => sum + (item.precio || 0) * (item.cantidad || 1), 0);
    this.totalPrice.set(total);
  }

  drop(event: CdkDragDrop<Item[]>) {
    if(event.previousContainer === event.container) {
      // Reordenar dentro de la misma lista
      const items = [...event.container.data];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      
      // Actualizar el signal correspondiente
      if(event.container.id === 'todoList') {
        this.todo.set(items);
      } else {
        this.done.set(items);
      }
    } else {
      const currentStepValue = this.currentStep();
      
      // Transferir entre listas diferentes
      if(event.previousContainer.id === 'todoList') {
        // De TODO a DONE
        const item = event.previousContainer.data[event.previousIndex];
        
        if (currentStepValue === 'tortilla') {
          // Para tortillas: solo una permitida, reemplazar si ya existe
          const doneItems = this.done();
          
          // Buscar si ya hay una tortilla en done
          const previousTortilla = doneItems.find(
            doneItem => doneItem.idAdcional! >= 1 && doneItem.idAdcional! <= 3
          );
          
          // Remover cualquier tortilla existente de done
          const filteredDone = doneItems.filter(
            doneItem => !(doneItem.idAdcional! >= 1 && doneItem.idAdcional! <= 3)
          );
          
          // Agregar la nueva tortilla a done
          this.done.set([...filteredDone, item]);
          
          // Actualizar todo: remover la seleccionada y agregar la anterior si existía
          const sourceItems = [...event.previousContainer.data];
          sourceItems.splice(event.previousIndex, 1);
          
          if (previousTortilla) {
            sourceItems.push(previousTortilla);
          }
          
          this.todo.set(sourceItems);
        } else {
          // Para otros ingredientes: permitir múltiples
          const sourceItems = [...event.previousContainer.data];
          const targetItems = [...event.container.data];
          
          transferArrayItem(
            sourceItems,
            targetItems,
            event.previousIndex,
            event.currentIndex
          );
          
          this.todo.set(sourceItems);
          this.done.set(targetItems);
        }
      } else {
        // De DONE a TODO
        const sourceItems = [...event.previousContainer.data];
        const targetItems = [...event.container.data];
        
        transferArrayItem(
          sourceItems,
          targetItems,
          event.previousIndex,
          event.currentIndex
        );
        
        this.done.set(sourceItems);
        this.todo.set(targetItems);
      }
      
      // Actualizar precio y validar paso
      this.calculateTotalPrice();
      this.updateCanGoToNextStep();
    }
  }

  clearTaco() {
    this.done.set([]);
    this.loadCategoryItems('tortilla');
    this.calculateTotalPrice();
    this.updateCanGoToNextStep();
  }
}
