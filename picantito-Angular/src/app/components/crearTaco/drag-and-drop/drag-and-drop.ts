import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../../../models/crearTaco/item';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { ProductoService } from '../../../services/tienda/producto.service';
import { CarritoService } from '../../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Adicional } from '../../../models/adicional';
import { Producto } from '../../../models/producto';
import { AdicionalSeleccionado } from '../../../models/cart-item';
@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-and-drop.html',
  styleUrls: ['./drag-and-drop.css']
})
export class DragAndDrop {

  // Exponer Math para el template
  Math = Math;

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

  // Estados de la UI
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  productoBase = signal<Producto | null>(null);

  constructor(
    private productoService: ProductoService,
    private adicionalService: AdicionalService,
    private carritoService: CarritoService,
    private router: Router
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
          this.productoBase.set(producto);
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
      image: adicional.imagen || this.getImageForAdicional(adicional.nombre || ''),
      precio: adicional.precioDeVenta || 0,
      cantidad: 1
    };
  }

  private getImageForAdicional(nombre: string): string {
    const nombreLower = nombre.toLowerCase();
    
    // Tortillas - detectar tipo específico
    if (nombreLower.includes('tortilla')) {
      if (nombreLower.includes('harina')) {
        return '/images/crearTaco/tortillas/tortillaHarina.png';
      }
      if (nombreLower.includes('integral')) {
        return '/images/crearTaco/tortillas/tortillaIntegral.png';
      }
      if (nombreLower.includes('maiz') || nombreLower.includes('maíz')) {
        return '/images/crearTaco/tortillas/tortillaMaiz.png';
      }
      // Si no se especifica el tipo, usar imagen genérica
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
      return '/images/crearTaco/salsas/habanera.png';
    }
    if (nombreLower.includes('chipotle')) {
      return '/images/crearTaco/salsas/chipotle.png';
    }
    if (nombreLower.includes('pico')) {
      return '/images/crearTaco/salsas/pico-gallo.png';
    }
    
    // Quesos
    if (nombreLower.includes('oaxaca')) {
      return '/images/crearTaco/extras/quesoOaxaca.png';
    }
    if (nombreLower.includes('cotija')) {
      return '/images/crearTaco/extras/quesoCotija.png';
    }
    
    // Vegetales
    if (nombreLower.includes('lechuga')) {
      return '/images/crearTaco/extras/lechuga.png';
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
    } else if (currentStepValue === 'extras' || currentStepValue === 'salsa') {
      // Extras y salsas son opcionales
      this.canGoToNextStep.set(true);
    }
  }

  goToNextStep() {
    const currentStepValue = this.currentStep();
    
    if (currentStepValue === 'tortilla') {
      this.loadCategoryItems('extras');
    } else if (currentStepValue === 'extras') {
      this.loadCategoryItems('proteína');
    } else if (currentStepValue === 'proteína') {
      this.loadCategoryItems('salsa');
    }
    
    this.updateCanGoToNextStep();
  }

  goToPreviousStep() {
    const currentStepValue = this.currentStep();
    
    if (currentStepValue === 'extras') {
      this.loadCategoryItems('tortilla');
    } else if (currentStepValue === 'proteína') {
      this.loadCategoryItems('extras');
    } else if (currentStepValue === 'salsa') {
      this.loadCategoryItems('proteína');
    }
    
    this.updateCanGoToNextStep();
  }

  private calculateTotalPrice() {
    const doneItems = this.done();
    const total = doneItems.reduce((sum, item) => sum + (item.precio || 0) * (item.cantidad || 1), 0);
    this.totalPrice.set(total);
  }

  drop(event: CdkDragDrop<Item[]>) {
    console.log('=== DROP EVENT START ===');
    console.log('Previous container:', event.previousContainer.id);
    console.log('Current container:', event.container.id);
    console.log('Previous index:', event.previousIndex);
    console.log('Current step:', this.currentStep());
    console.log('TODO signal array:', this.todo());
    console.log('DONE signal array:', this.done());
    console.log('event.item.data (el item arrastrado):', event.item.data);
    
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
        // De TODO a DONE - Usar event.item.data que tiene el item correcto
        const item = event.item.data as Item;
        console.log('Item arrastrado desde TODO:', item);
        console.log('Nombre del item:', item?.nombre);
        console.log('ID del item:', item?.idAdcional);
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
          const sourceItems = this.todo().filter(t => t.idAdcional !== item.idAdcional);
          if (previousTortilla) {
            sourceItems.push(previousTortilla);
          }
          this.todo.set(sourceItems);
        } else {
          // Para otros ingredientes: permitir múltiples
          const sourceItems = this.todo().filter(t => t.idAdcional !== item.idAdcional);
          let targetItems = [...this.done(), item];
          // Ordenar done para que la tortilla quede de primera
          targetItems = this.sortDoneWithTortillaFirst(targetItems);
          this.todo.set(sourceItems);
          this.done.set(targetItems);
        }
      } else {
        // De DONE a TODO
        const item = event.item.data as Item;
        let sourceItems = this.done().filter(d => d.idAdcional !== item.idAdcional);
        const targetItems = [...this.todo(), item];
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

  /**
   * Verifica si el taco puede ser agregado al carrito
   */
  get puedeAgregarAlCarrito(): boolean {
    const doneItems = this.done();
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    const proteinaIds = this.proteinas().map(p => p.idAdcional);
    
    const tieneTortilla = doneItems.some(item => tortillaIds.includes(item.idAdcional));
    const tieneProteina = doneItems.some(item => proteinaIds.includes(item.idAdcional));
    
    return tieneTortilla && tieneProteina && doneItems.length > 0;
  }

  /**
   * Agregar el taco personalizado al carrito
   */
  agregarAlCarrito(): void {
    if (!this.puedeAgregarAlCarrito) {
      this.error.set('Debes seleccionar al menos una tortilla y una proteína para crear tu taco');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    const productoBaseValue = this.productoBase();
    if (!productoBaseValue) {
      this.error.set('Error: No se pudo cargar el producto base');
      setTimeout(() => this.error.set(null), 3000);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const doneItems = this.done();
      const descripcion = this.generarDescripcionTaco(doneItems);
      
      const productoParaCarrito: Producto = {
        ...productoBaseValue,
        descripcion: descripcion,
        precioDeVenta: 0,
        activo: true,
        disponible: true
      };

      const adicionalesSeleccionados: AdicionalSeleccionado[] = this.construirAdicionalesSeleccionados(doneItems);
      
      this.carritoService.agregarItemConAdicionales(productoParaCarrito, 1, adicionalesSeleccionados);

      this.successMessage.set('¡Taco personalizado agregado al carrito exitosamente!');
      this.loading.set(false);

      setTimeout(() => {
        this.router.navigate(['/tienda']);
      }, 1500);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      this.error.set('Error al agregar el taco al carrito');
      this.loading.set(false);
    }
  }

  /**
   * Construir lista de adicionales seleccionados para el carrito
   */
  private construirAdicionalesSeleccionados(items: Item[]): AdicionalSeleccionado[] {
    const adicionalesSeleccionados: AdicionalSeleccionado[] = [];
    const todosAdicionalesCargados = this.adcionales();

    for (const item of items) {
      const adicionalCompleto = todosAdicionalesCargados.find(a => a.id === item.idAdcional);
      
      if (adicionalCompleto) {
        const precio = adicionalCompleto.precioDeVenta || adicionalCompleto.precio || 0;
        adicionalesSeleccionados.push({
          adicional: adicionalCompleto,
          cantidad: item.cantidad || 1,
          subtotal: precio * (item.cantidad || 1)
        });
      }
    }

    return adicionalesSeleccionados;
  }

  /**
   * Generar descripción del taco basada en los items seleccionados
   */
  private generarDescripcionTaco(items: Item[]): string {
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    const proteinaIds = this.proteinas().map(p => p.idAdcional);
    const salsaIds = this.salsas().map(s => s.idAdcional);
    const extraIds = this.extras().map(e => e.idAdcional);

    let descripcion = '';

    // Tortilla
    const tortilla = items.find(item => tortillaIds.includes(item.idAdcional));
    if (tortilla) {
      descripcion += `Tortilla: ${tortilla.nombre}\n`;
    }

    // Proteínas
    const proteinas = items.filter(item => proteinaIds.includes(item.idAdcional));
    if (proteinas.length > 0) {
      descripcion += `Proteínas: ${proteinas.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')}\n`;
    }

    // Salsas
    const salsas = items.filter(item => salsaIds.includes(item.idAdcional));
    if (salsas.length > 0) {
      descripcion += `Salsas: ${salsas.map(s => `${s.nombre} (x${s.cantidad})`).join(', ')}\n`;
    }

    // Extras
    const extras = items.filter(item => extraIds.includes(item.idAdcional));
    if (extras.length > 0) {
      descripcion += `Extras: ${extras.map(e => `${e.nombre} (x${e.cantidad})`).join(', ')}\n`;
    }

    return descripcion;
  }

  /**
   * Eliminar un item de la lista done
   */
  removeItemFromDone(item: Item): void {
    const doneItems = this.done();
    const todoItems = this.todo();
    const tortillaIds = this.tortillas().map(t => t.idAdcional);
    
    // Verificar si es la tortilla
    const isTortilla = tortillaIds.includes(item.idAdcional);
    
    // Si es tortilla y hay otros ingredientes encima, no permitir borrar
    if (isTortilla && doneItems.length > 1) {
      this.error.set('No puedes eliminar la tortilla mientras haya ingredientes encima. Usa el botón "Limpiar" para borrar todo.');
      setTimeout(() => this.error.set(null), 8000);
      return;
    }
    
    // Remover el item de done
    const updatedDone = doneItems.filter(i => i.idAdcional !== item.idAdcional);
    this.done.set(updatedDone);
    
    // Devolver el item a todo solo si corresponde al step actual o si es tortilla
    const currentStepValue = this.currentStep();
    const shouldReturnToTodo = 
      (isTortilla && currentStepValue === 'tortilla') ||
      (this.proteinas().some(p => p.idAdcional === item.idAdcional) && currentStepValue === 'proteína') ||
      (this.salsas().some(s => s.idAdcional === item.idAdcional) && currentStepValue === 'salsa') ||
      (this.extras().some(e => e.idAdcional === item.idAdcional) && currentStepValue === 'extras');
    
    if (shouldReturnToTodo) {
      todoItems.push(item);
      this.todo.set(todoItems);
    }
    
    // Recalcular precio
    this.calculateTotalPrice();
    
    // Actualizar validación del step
    this.updateCanGoToNextStep();
  }

  /**
   * Calcular altura dinámica del contenedor según número de ingredientes
   */
  getContainerHeight(): number {
    const nonSalsaItems = this.done().filter(
      item => item.nombre && 
              !item.nombre.toLowerCase().includes('salsa') && 
              !item.nombre.toLowerCase().includes('pico')
    );
    const baseHeight = 500;
    const heightPerItem = 5;
    return baseHeight + (Math.max(0, nonSalsaItems.length - 1) * heightPerItem);
  }

  /**
   * Calcular altura del stack de ingredientes
   */
  getStackHeight(): number {
    const nonSalsaItems = this.done().filter(
      item => item.nombre && 
              !item.nombre.toLowerCase().includes('salsa') && 
              !item.nombre.toLowerCase().includes('pico')
    );
    const baseHeight = 450;
    const heightPerItem = 5;
    return baseHeight + (Math.max(0, nonSalsaItems.length - 1) * heightPerItem);
  }

  /**
   * Calcula el desplazamiento vertical para cada ingrediente
   * La tortilla (idx 0) y el primer ingrediente (idx 1) quedan al mismo nivel
   * A partir del tercer elemento (idx 2) comienzan a subir
   */
  getIngredientTranslateY(item: any): number {
    // Obtener solo los items que no son salsas
    const nonSalsaItems = this.done().filter(
      i => i.nombre && 
           !i.nombre.toLowerCase().includes('salsa') && 
           !i.nombre.toLowerCase().includes('pico')
    );
    
    // Encontrar el índice de este item entre los no-salsa
    const index = nonSalsaItems.findIndex(i => i.idAdcional === item.idAdcional);
    
    if (index <= 1) {
      return 0; // Tortilla y primer ingrediente al mismo nivel
    }
    return (index - 1) * -40; // A partir del segundo ingrediente, subir 40px por cada uno
  }

  /**
   * Cancelar y volver a la tienda
   */
  cancelar(): void {
    this.router.navigate(['/tienda']);
  }
}
