import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Adicional } from '../../../models/adicional';
import { Producto } from '../../../models/producto';
import { TacoPersonalizado, AdicionalSeleccionado, TipoTortilla, CategoriaAdicional } from '../../../models/taco-personalizado';
import { AdicionalService } from '../../../services/tienda/adicional.service';
import { CarritoService } from '../../../services/carrito.service';

@Component({
  selector: 'app-crear-taco',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-taco.html',
  styleUrl: './crear-taco.css'
})
export class CrearTaco implements OnInit {
  // Datos para el formulario
  tortillas = signal<TipoTortilla[]>([]);
  // Ahora las proteínas se tratarán como un subconjunto de adicionales (categoría PROTEÍNAS)
  proteinas = signal<Adicional[]>([]);
  categoriasAdicionales = signal<CategoriaAdicional[]>([]);

  // Estado del taco personalizado
  tacoPersonalizado = signal<TacoPersonalizado>({
    nombre: 'Mi Taco Personalizado',
    tortilla: null,
    proteina: null,
    vegetales: [],
    salsas: [],
    quesos: [],
    extras: [],
    precioTotal: 0,
    descripcion: ''
  });

  // Estados de la UI
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  seccionActiva = signal<string>('tortilla');

  constructor(
    private adicionalService: AdicionalService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarTortillas();
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.adicionalService.getAdicionalesCategorizados().subscribe({
      next: (resp) => {
        // Asignar directamente desde respuesta categorizada
        this.proteinas.set(resp.proteinas.filter(a => a.disponible && a.activo));
        const vegetales = resp.vegetales.filter(a => a.disponible && a.activo);
        const salsas = resp.salsas.filter(a => a.disponible && a.activo);
        const quesos = resp.quesos.filter(a => a.disponible && a.activo);
        const extras = resp.extras.filter(a => a.disponible && a.activo);
        // Convertir a estructura de categorias existente
        const categorias: CategoriaAdicional[] = [
          { nombre: 'Vegetales', descripcion: 'Vegetales frescos y crujientes', icono: 'fas fa-carrot', multipleSeleccion: true, items: vegetales },
          { nombre: 'Salsas', descripcion: 'Salsas artesanales y tradicionales', icono: 'fas fa-fire', multipleSeleccion: true, items: salsas },
          { nombre: 'Quesos', descripcion: 'Quesos frescos y derretidos', icono: 'fas fa-cheese', multipleSeleccion: true, items: quesos },
          { nombre: 'Extras', descripcion: 'Ingredientes especiales y únicos', icono: 'fas fa-plus-circle', multipleSeleccion: true, items: extras }
        ];
        this.categoriasAdicionales.set(categorias);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar adicionales categorizados:', error);
        this.error.set('Error al cargar los adicionales categorizados');
        this.loading.set(false);
      }
    });
  }

  private inicializarTortillas(): void {
    const tortillasDisponibles: TipoTortilla[] = [
      {
        id: 1,
        nombre: 'Tortilla de Maíz',
        precio: 0,
        descripcion: 'Tortilla tradicional mexicana de maíz blanco, suave y auténtica',
        imagen: '/images/tortilla-maiz.jpg'
      },
      {
        id: 2,
        nombre: 'Tortilla de Harina',
        precio: 500,
        descripcion: 'Tortilla suave de harina de trigo, perfecta para tacos grandes',
        imagen: '/images/tortilla-harina.jpg'
      },
      {
        id: 3,
        nombre: 'Tortilla Integral',
        precio: 800,
        descripcion: 'Opción saludable de harina integral con fibra extra',
        imagen: '/images/tortilla-integral.jpg'
      },
      {
        id: 4,
        nombre: 'Tortilla de Nopal',
        precio: 1200,
        descripcion: 'Innovadora tortilla con nopal, baja en carbohidratos',
        imagen: '/images/tortilla-nopal.jpg'
      }
    ];
    this.tortillas.set(tortillasDisponibles);
  }

  // Ya no se requiere organizar por nombres clave: la API entrega categorías listas

  private filtrarPorNombre(adicionales: Adicional[], nombres: string[]): Adicional[] {
    return adicionales.filter(adicional =>
      nombres.some(nombre =>
        adicional.nombre?.toLowerCase().includes(nombre.toLowerCase())
      )
    );
  }

  // Seleccionar tortilla
  seleccionarTortilla(tortilla: TipoTortilla): void {
    const tacoActual = this.tacoPersonalizado();
    this.tacoPersonalizado.set({
      ...tacoActual,
      tortilla: tortilla
    });
    this.calcularPrecioTotal();
  }

  // Seleccionar proteína
  seleccionarProteina(proteina: Adicional): void {
    const tacoActual = this.tacoPersonalizado();
    this.tacoPersonalizado.set({
      ...tacoActual,
      proteina: proteina
    });
    this.calcularPrecioTotal();
  }

  // Toggle adicional por categoría
  toggleAdicional(adicional: Adicional, categoria: string): void {
    const tacoActual = this.tacoPersonalizado();
    const categoriaKey = categoria.toLowerCase() as keyof Pick<TacoPersonalizado, 'vegetales' | 'salsas' | 'quesos' | 'extras'>;

    const listaActual = tacoActual[categoriaKey] as AdicionalSeleccionado[];
    const adicionalExistente = listaActual.find(a => a.adicional.id === adicional.id);

    if (adicionalExistente) {
      // Si ya existe, lo quitamos
      const nuevaLista = listaActual.filter(a => a.adicional.id !== adicional.id);
      this.tacoPersonalizado.set({
        ...tacoActual,
        [categoriaKey]: nuevaLista
      });
    } else {
      // Si no existe, lo agregamos
      const nuevaLista = [...listaActual, { adicional, cantidad: 1 }];
      this.tacoPersonalizado.set({
        ...tacoActual,
        [categoriaKey]: nuevaLista
      });
    }
    this.calcularPrecioTotal();
  }

  // Cambiar cantidad de adicional
  cambiarCantidadAdicional(adicionalId: number, nuevaCantidad: number, categoria: string): void {
    if (nuevaCantidad <= 0) {
      this.removerAdicional(adicionalId, categoria);
      return;
    }

    const tacoActual = this.tacoPersonalizado();
    const categoriaKey = categoria.toLowerCase() as keyof Pick<TacoPersonalizado, 'vegetales' | 'salsas' | 'quesos' | 'extras'>;
    const listaActual = tacoActual[categoriaKey] as AdicionalSeleccionado[];

    const nuevaLista = listaActual.map(item =>
      item.adicional.id === adicionalId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );

    this.tacoPersonalizado.set({
      ...tacoActual,
      [categoriaKey]: nuevaLista
    });
    this.calcularPrecioTotal();
  }

  // Remover adicional
  removerAdicional(adicionalId: number, categoria: string): void {
    const tacoActual = this.tacoPersonalizado();
    const categoriaKey = categoria.toLowerCase() as keyof Pick<TacoPersonalizado, 'vegetales' | 'salsas' | 'quesos' | 'extras'>;
    const listaActual = tacoActual[categoriaKey] as AdicionalSeleccionado[];

    const nuevaLista = listaActual.filter(a => a.adicional.id !== adicionalId);
    this.tacoPersonalizado.set({
      ...tacoActual,
      [categoriaKey]: nuevaLista
    });
    this.calcularPrecioTotal();
  }

  // Calcular precio total
  private calcularPrecioTotal(): void {
    const taco = this.tacoPersonalizado();
    let total = 0;

    // Precio de la tortilla
    if (taco.tortilla) {
      total += taco.tortilla.precio;
    }

    // Precio de la proteína
    if (taco.proteina) {
      total += taco.proteina.precioDeVenta || taco.proteina.precio || 0;
    }

    // Precio de todos los adicionales
    const todasLasListas = [taco.vegetales, taco.salsas, taco.quesos, taco.extras];
    todasLasListas.forEach(lista => {
      lista.forEach(item => {
        const precio = item.adicional.precioDeVenta || item.adicional.precio || 0;
        total += precio * item.cantidad;
      });
    });

    this.tacoPersonalizado.set({
      ...taco,
      precioTotal: total
    });
  }

  // Verificar si un adicional está seleccionado
  esAdicionalSeleccionado(adicionalId: number, categoria: string): boolean {
    const taco = this.tacoPersonalizado();
    const categoriaKey = categoria.toLowerCase() as keyof Pick<TacoPersonalizado, 'vegetales' | 'salsas' | 'quesos' | 'extras'>;
    const lista = taco[categoriaKey] as AdicionalSeleccionado[];
    return lista.some(a => a.adicional.id === adicionalId);
  }

  // Obtener cantidad de un adicional
  getCantidadAdicional(adicionalId: number, categoria: string): number {
    const taco = this.tacoPersonalizado();
    const categoriaKey = categoria.toLowerCase() as keyof Pick<TacoPersonalizado, 'vegetales' | 'salsas' | 'quesos' | 'extras'>;
    const lista = taco[categoriaKey] as AdicionalSeleccionado[];
    const item = lista.find(a => a.adicional.id === adicionalId);
    return item?.cantidad || 0;
  }

  // Cambiar sección activa
  cambiarSeccion(seccion: string): void {
    this.seccionActiva.set(seccion);
  }

  // Verificar si el taco está listo para agregar al carrito
  get puedeAgregarAlCarrito(): boolean {
    const taco = this.tacoPersonalizado();
    return taco.tortilla !== null && taco.proteina !== null && taco.precioTotal > 0;
  }

  // Finalizar y agregar al carrito
  finalizarTaco(): void {
    if (!this.puedeAgregarAlCarrito) {
      this.error.set('Debes seleccionar una tortilla y una proteína para crear tu taco');
      return;
    }

    const taco = this.tacoPersonalizado();

    // Crear un producto "virtual" que represente el taco personalizado
    const tacoProducto: Producto = {
      id: Date.now(), // ID temporal único
      nombre: taco.nombre,
      descripcion: this.generarDescripcionTaco(taco),
      precioDeVenta: taco.precioTotal,
      imagen: '/images/taco1.webp', // Imagen por defecto
      disponible: true,
      activo: true
    };

    // Agregar al carrito
    this.carritoService.agregarItem(tacoProducto, 1);

    // Mostrar mensaje de éxito
    this.successMessage.set('¡Taco personalizado agregado al carrito exitosamente!');
    this.error.set(null);

    // Redirigir después de 2 segundos
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  // Generar descripción del taco
  private generarDescripcionTaco(taco: TacoPersonalizado): string {
    let descripcion = '';

    if (taco.tortilla) {
      descripcion += `Tortilla: ${taco.tortilla.nombre}\n`;
    }

    if (taco.proteina) {
      descripcion += `Proteína: ${taco.proteina.nombre}\n`;
    }

    const categoriasConItems = [
      { nombre: 'Vegetales', items: taco.vegetales },
      { nombre: 'Salsas', items: taco.salsas },
      { nombre: 'Quesos', items: taco.quesos },
      { nombre: 'Extras', items: taco.extras }
    ];

    categoriasConItems.forEach(categoria => {
      if (categoria.items.length > 0) {
        descripcion += `${categoria.nombre}: `;
        const textos = categoria.items.map(item =>
          `${item.adicional.nombre} (x${item.cantidad})`
        );
        descripcion += textos.join(', ') + '\n';
      }
    });

    return descripcion;
  }

  // Cancelar y volver al menú
  cancelar(): void {
    this.router.navigate(['/tienda']);
  }
}
