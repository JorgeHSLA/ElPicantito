import { Pedido } from "../../models/pedido";
import { ClienteService } from "../usuarios/cliente.service";
import { RepartidorService } from "../usuarios/repartidor.service";
import { ProductoService } from "./producto.service";




export class PedidoService {
  private pedidos: Pedido[];

  constructor(
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private repartidorService: RepartidorService
  ) {
    // obtener datos de servicios
    const productos = this.productoService.getProductos();
    const clientes = this.clienteService.getClientes();
    const repartidores = this.repartidorService.getRepartidores();

    this.pedidos = [
      {
        id: 1,
        precio: 61000, // 2 hamburguesas (18000 * 2) + 1 pizza (25000)
        precioDeAdquisicion: 35000, // 2*10000 + 15000
        fechaEntrega: new Date("2025-09-22"),
        fechaSolicitud: new Date("2025-09-20"),
        estado: "ENVIADO",
        direccion: "Calle 123 #45-67, Bogotá",
        cliente: clientes[0], // Carlos Gómez
        repartidor: repartidores[0], // Pedro Sánchez
        productos: new Map([
          [productos[0], 2], // Hamburguesa Clásica x2
          [productos[1], 1]  // Pizza Pepperoni x1
        ])
      },
      {
        id: 2,
        precio: 47000, // 1 ensalada (15000) + 2 tacos (20000*2)
        precioDeAdquisicion: 32000, // 8000 + 24000
        fechaEntrega: new Date("2025-09-23"),
        fechaSolicitud: new Date("2025-09-21"),
        estado: "PENDIENTE",
        direccion: "Carrera 45 #67-89, Medellín",
        cliente: clientes[1], // María Rodríguez
        repartidor: repartidores[1], // Laura Fernández
        productos: new Map([
          [productos[3], 1], // Ensalada César x1
          [productos[4], 2]  // Tacos Mexicanos x2
        ])
      }
    ];
  }

  getPedidos(): Pedido[] {
    return this.pedidos;
  }
}
