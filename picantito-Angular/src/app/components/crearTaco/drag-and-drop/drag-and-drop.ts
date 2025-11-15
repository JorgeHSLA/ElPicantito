import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, signal } from '@angular/core';
import { Item } from '../../../models/crearTaco/item';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { ProductoService } from '../../../services/tienda/producto.service';
import { CommonModule } from '@angular/common';
import { Adicional } from '../../../models/adicional';
@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-and-drop.html',
  styleUrls: ['./drag-and-drop.css']
})
export class DragAndDrop {

  // Usando signals para estado reactivo
  todo = signal<Item[]>([]);
  done = signal<Item[]>([]);
  currentStep = signal<string>('tortilla');
  totalPrice = signal<number>(0);
  canGoToNextStep = signal<boolean>(false);

  adcionales = signal<Adicional[]>([]);
  
  // Categorías de ingredientes cargadas desde el servicio
  private tortillas = signal<Item[]>([]);
  private proteinas = signal<Item[]>([]);
  private salsas = signal<Item[]>([]);
  private extras = signal<Item[]>([]);

  constructor(
    private productoService: ProductoService,
    private adicionalService: AdicionalService,
  ) {}


  ngOnInit() {
    // Cargar adicionales del producto "Taco Personalizado" desde el backend
    this.loadAdicionalesFromService();
  }

  private loadAdicionalesFromService() {
    // 1. Obtener el producto "Taco Personalizado" por nombre
    this.productoService.getProductoByName('Taco Personalizado').subscribe({
      next: (producto) => {
        if (producto && producto.id) {
          // 2. Usar el ID del producto para obtener los adicionales asociados
          this.adicionalService.getAdicionalesPorProducto(producto.id).subscribe({
            next: (adicionales) => {
              this.adcionales.set(adicionales);
              
              // 3. Filtrar por nombres para categorizar (mismo filtro que antes)
              this.tortillas.set(
                adicionales
                  .filter(a => a.nombre && 
                              (a.nombre.toLowerCase().includes('tortilla')))
                  .map(a => this.mapAdicionalToItem(a))
              );

              this.proteinas.set(
                adicionales
                  .filter(a => a.nombre && 
                              (a.nombre.toLowerCase().includes('carne') ||
                               a.nombre.toLowerCase().includes('pollo') ||
                               a.nombre.toLowerCase().includes('pastor') ||
                               a.nombre.toLowerCase().includes('carnitas') ||
                               a.nombre.toLowerCase().includes('chorizo')))
                  .map(a => this.mapAdicionalToItem(a))
              );

              this.salsas.set(
                adicionales
                  .filter(a => a.nombre && 
                              (a.nombre.toLowerCase().includes('salsa') ||
                               a.nombre.toLowerCase().includes('pico')))
                  .map(a => this.mapAdicionalToItem(a))
              );

              this.extras.set(
                adicionales
                  .filter(a => a.nombre && 
                              (a.nombre.toLowerCase().includes('queso') ||
                               a.nombre.toLowerCase().includes('lechuga')))
                  .map(a => this.mapAdicionalToItem(a))
              );

              // Inicializar con tortillas
              this.loadCategoryItems('tortilla');
              this.done.set([]);
            },
            error: (error) => {
              console.error('Error cargando adicionales del producto:', error);
              // Inicializar vacío en caso de error
              this.loadCategoryItems('tortilla');
              this.done.set([]);
            }
          });
        } else {
          console.error('Producto "Taco Personalizado" no encontrado');
          this.loadCategoryItems('tortilla');
          this.done.set([]);
        }
      },
      error: (error) => {
        console.error('Error obteniendo producto "Taco Personalizado":', error);
        // Inicializar vacío en caso de error
        this.loadCategoryItems('tortilla');
        this.done.set([]);
      }
    });
  }

  private mapAdicionalToItem(adicional: Adicional): Item {
    return {
      idAdcional: adicional.id,
      nombre: adicional.nombre || 'Sin nombre',
      image: this.getImageForAdicional(adicional.nombre || ''),
      precio: adicional.precioDeVenta || 0,
      cantidad: 1
    };
  }

  private getImageForAdicional(nombre: string): string {
    const nombreLower = nombre.toLowerCase();
    
    // Tortillas
    if (nombreLower.includes('tortilla')) {
      return '/images/crearTaco/tortillas/tortilla.png';
    }
    
    // Proteínas
    if (nombreLower.includes('carne') || nombreLower.includes('asada')) {
      return '/images/crearTaco/proteinas/carne-asada.png';
    }
    if (nombreLower.includes('pollo')) {
      return '/images/crearTaco/proteinas/pollo.png';
    }
    if (nombreLower.includes('pastor')) {
      return '/images/crearTaco/proteinas/pastor.png';
    }
    if (nombreLower.includes('carnitas')) {
      return '/images/crearTaco/proteinas/carnitas.png';
    }
    if (nombreLower.includes('chorizo')) {
      return '/images/crearTaco/proteinas/chorizo.png';
    }
    
    // Salsas
    if (nombreLower.includes('verde')) {
      return '/images/crearTaco/salsas/SalsaVerde.png';
    }
    if (nombreLower.includes('roja')) {
      return '/images/crearTaco/salsas/SalsaRoja.png';
    }
    if (nombreLower.includes('habanera')) {
      return '/images/crearTaco/salsas/habanera.jpg';
    }
    if (nombreLower.includes('chipotle')) {
      return '/images/crearTaco/salsas/chipotle.jpg';
    }
    if (nombreLower.includes('pico')) {
      return '/images/crearTaco/salsas/pico-gallo.jpg';
    }
    
    // Quesos
    if (nombreLower.includes('oaxaca')) {
      return '/images/crearTaco/quesos/oaxaca.jpg';
    }
    if (nombreLower.includes('cotija')) {
      return '/images/crearTaco/quesos/cotija.jpg';
    }
    
    // Vegetales
    if (nombreLower.includes('lechuga')) {
      return '/images/crearTaco/vegetales/lechuga.jpg';
    }
    
    // Imagen por defecto
    return '/images/default-ingredient.png';
  }

  private loadCategoryItems(category: string) {
    const doneItems = this.done();
    let availableItems: Item[] = [];
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    const proteinaIds = this.proteinas().map(p => p.idAdcional);
    const salsaIds = this.salsas().map(s => s.idAdcional);
    const extraIds = this.extras().map(e => e.idAdcional);

    switch(category) {
      case 'tortilla':
        // Para tortillas, mostrar todas MENOS la que está actualmente en done
        const currentTortillaInDone = doneItems.find(
          item => tortillaIds.includes(item.idAdcional)
        );
        
        availableItems = this.tortillas().filter(
          tortilla => tortilla.idAdcional !== currentTortillaInDone?.idAdcional
        );
        break;
      case 'proteína':
        // Para proteínas, mostrar todas MENOS las que ya están en done
        const doneProteinIds = doneItems
          .filter(item => proteinaIds.includes(item.idAdcional))
          .map(item => item.idAdcional);
        
        availableItems = this.proteinas().filter(
          proteina => !doneProteinIds.includes(proteina.idAdcional)
        );
        break;
      case 'salsa':
        // Para salsas, mostrar todas MENOS las que ya están en done
        const doneSalsaIds = doneItems
          .filter(item => salsaIds.includes(item.idAdcional))
          .map(item => item.idAdcional);
        
        availableItems = this.salsas().filter(
          salsa => !doneSalsaIds.includes(salsa.idAdcional)
        );
        break;
      case 'extras':
        // Para extras, mostrar todas MENOS las que ya están en done
        const doneExtraIds = doneItems
          .filter(item => extraIds.includes(item.idAdcional))
          .map(item => item.idAdcional);
        
        availableItems = this.extras().filter(
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
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    const proteinaIds = this.proteinas().map(p => p.idAdcional);
    
    if (currentStepValue === 'tortilla') {
      // Debe tener al menos una tortilla
      this.canGoToNextStep.set(
        doneItems.some(item => tortillaIds.includes(item.idAdcional))
      );
    } else if (currentStepValue === 'proteína') {
      // Debe tener al menos una proteína
      this.canGoToNextStep.set(
        doneItems.some(item => proteinaIds.includes(item.idAdcional))
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
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    
    if(event.previousContainer === event.container) {
      // Reordenar dentro de la misma lista
      let items = [...event.container.data];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      // Si es la lista done, aseguramos que la tortilla quede de primera
      if(event.container.id === 'doneList') {
        items = this.sortDoneWithTortillaFirst(items);
        this.done.set(items);
      } else {
        this.todo.set(items);
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
            doneItem => tortillaIds.includes(doneItem.idAdcional)
          );
          // Remover cualquier tortilla existente de done
          const filteredDone = doneItems.filter(
            doneItem => !tortillaIds.includes(doneItem.idAdcional)
          );
          // Agregar la nueva tortilla a done y ordenar
          const newDone = this.sortDoneWithTortillaFirst([item, ...filteredDone]);
          this.done.set(newDone);
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
          let targetItems = [...event.container.data];
          transferArrayItem(
            sourceItems,
            targetItems,
            event.previousIndex,
            event.currentIndex
          );
          // Ordenar done para que la tortilla quede de primera
          targetItems = this.sortDoneWithTortillaFirst(targetItems);
          this.todo.set(sourceItems);
          this.done.set(targetItems);
        }
      } else {
        // De DONE a TODO
        let sourceItems = [...event.previousContainer.data];
        const targetItems = [...event.container.data];
        transferArrayItem(
          sourceItems,
          targetItems,
          event.previousIndex,
          event.currentIndex
        );
        // Ordenar done para que la tortilla quede de primera
        sourceItems = this.sortDoneWithTortillaFirst(sourceItems);
        this.done.set(sourceItems);
        this.todo.set(targetItems);
        
        // Si done quedó vacío, volver al paso de tortilla
        if (sourceItems.length === 0) {
          this.loadCategoryItems('tortilla');
        }
      }
      // Actualizar precio y validar paso
      this.calculateTotalPrice();
      this.updateCanGoToNextStep();
    }
  }

  /**
   * Ordena la lista done para que la tortilla quede siempre de primera
   */
  private sortDoneWithTortillaFirst(items: Item[]): Item[] {
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    const tortillas = items.filter(i => tortillaIds.includes(i.idAdcional));
    const others = items.filter(i => !tortillaIds.includes(i.idAdcional));
    return [...tortillas, ...others];
  }

  clearTaco() {
    this.done.set([]);
    this.loadCategoryItems('tortilla');
    this.calculateTotalPrice();
    this.updateCanGoToNextStep();
  }

  /**
   * Obtiene solo las salsas de la lista done
   */
  getSalsas(): Item[] {
    return this.done().filter(item => 
      item.nombre?.toLowerCase().includes('salsa') || 
      item.nombre?.toLowerCase().includes('pico')
    );
  }
}
