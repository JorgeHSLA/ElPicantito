import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface OrderStatus {
  id: number;
  status: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  active: boolean;
  icon: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderInfo {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  paymentMethod: string;
}

@Component({
  selector: 'app-rastreo-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rastreo-pedido.html',
  styleUrl: './rastreo-pedido.css'
})
export class RastreoPedidoComponent implements OnInit {
  currentStatus = signal(1);
  orderInfo = signal<OrderInfo | null>(null);

  orderStatuses: OrderStatus[] = [
    {
      id: 1,
      status: 'accepted',
      title: 'Pedido Aceptado',
      description: 'Tu pedido ha sido recibido y confirmado',
      time: '',
      completed: false,
      active: false,
      icon: 'bi-check-circle'
    },
    {
      id: 2,
      status: 'cooking',
      title: 'Pedido Cocinándose',
      description: 'Nuestros chefs están preparando tu deliciosa comida',
      time: '',
      completed: false,
      active: false,
      icon: 'bi-fire'
    },
    {
      id: 3,
      status: 'onway',
      title: 'Pedido en Camino',
      description: 'Tu pedido está siendo entregado por nuestro repartidor',
      time: '',
      completed: false,
      active: false,
      icon: 'bi-truck'
    },
    {
      id: 4,
      status: 'delivered',
      title: 'Pedido Entregado',
      description: '¡Disfruta tu comida! Gracias por elegirnos',
      time: '',
      completed: false,
      active: false,
      icon: 'bi-house-check'
    }
  ];

  // Coordenadas simuladas para el mapa
  mapLocations = {
    restaurant: { lat: 4.7110, lng: -74.0721, name: 'El Picantito' },
    customer: { lat: 4.6097, lng: -74.0817, name: 'Tu ubicación' },
    delivery: { lat: 4.7110, lng: -74.0721, name: 'Repartidor' }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar si el usuario está logueado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Simular datos de pedido
    this.generateMockOrderData();

    // Iniciar simulación de estados
    this.startOrderSimulation();
  }

  private generateMockOrderData() {
    const now = new Date();
    const orderDate = new Date(now.getTime() - (30 * 60 * 1000)); // 30 minutos atrás
    const deliveryTime = new Date(now.getTime() + (25 * 60 * 1000)); // 25 minutos adelante

    // Datos simulados del pedido basados en una compra típica
    const mockOrder: OrderInfo = {
      orderId: this.generateOrderId(),
      orderDate: this.formatTime(orderDate),
      estimatedDelivery: this.formatTime(deliveryTime),
      customerInfo: {
        name: this.authService.loggedUser()?.nombreCompleto?.toString() || 'Cliente',
        address: 'Calle 123 #45-67, Bogotá, Colombia',
        phone: '+57 300 123 4567'
      },
      items: [
        {
          name: 'Taco Especial El Picantito',
          quantity: 2,
          price: 12000,
          image: '/images/taco1.webp'
        },
        {
          name: 'Taco Vegetariano',
          quantity: 1,
          price: 10000,
          image: '/images/taco2.webp'
        },
        {
          name: 'Bebida Refrescante',
          quantity: 2,
          price: 3000,
          image: '/images/taco3.webp'
        }
      ],
      subtotal: 40000,
      delivery: 0,
      total: 40000,
      paymentMethod: 'Tarjeta de Crédito'
    };

    this.orderInfo.set(mockOrder);
  }

  private generateOrderId(): string {
    return '#EP' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  private startOrderSimulation() {
    // Simular progreso del pedido cada 15 segundos
    let currentStep = 1;

    // Establecer el primer estado como activo
    this.updateOrderStatus(currentStep);

    const interval = setInterval(() => {
      if (currentStep < 4) {
        currentStep++;
        this.updateOrderStatus(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 15000); // Cambiar estado cada 15 segundos
  }

  private updateOrderStatus(step: number) {
    this.currentStatus.set(step);

    // Actualizar estados
    this.orderStatuses = this.orderStatuses.map((status, index) => ({
      ...status,
      completed: index < step - 1,
      active: index === step - 1,
      time: index === step - 1 ? new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) : status.time
    }));

    // Simular movimiento del repartidor
    if (step >= 3) {
      this.simulateDeliveryMovement();
    }
  }

  private simulateDeliveryMovement() {
    // Simular movimiento del repartidor hacia la ubicación del cliente
    const progress = (this.currentStatus() - 2) / 2; // De 0 a 1

    this.mapLocations.delivery = {
      lat: this.mapLocations.restaurant.lat +
           (this.mapLocations.customer.lat - this.mapLocations.restaurant.lat) * progress,
      lng: this.mapLocations.restaurant.lng +
           (this.mapLocations.customer.lng - this.mapLocations.restaurant.lng) * progress,
      name: 'Repartidor'
    };
  }

  // Simular llamada al repartidor
  callDelivery() {
    alert('¡Llamando al repartidor! Te contactará en breve.');
  }

  // Ir a calificar pedido
  rateOrder() {
    alert('¡Gracias por tu pedido! Te redirigiremos a la página de calificación.');
    // Aquí se podría navegar a una página de calificación
  }

  // Volver a inicio
  goHome() {
    this.router.navigate(['/home']);
  }

  // Hacer nuevo pedido
  orderAgain() {
    this.router.navigate(['/tienda']);
  }
}
