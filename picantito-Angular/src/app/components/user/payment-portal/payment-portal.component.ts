import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import { PedidoManagerService } from '../../../services/tienda/pedido-manager.service';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-payment-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment-portal.html',
  styleUrl: './payment-portal.css'
})
export class PaymentPortalComponent {
  selectedPaymentMethod = signal<string>('');
  isProcessingPayment = signal(false);
  total = signal(0);
  
  // Datos del checkout (recuperados de sessionStorage)
  checkoutData: any = null;

  // Datos de tarjeta
  cardData = {
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  };

  // Datos de PSE
  pseData = {
    bank: '',
    documentType: 'CC',
    documentNumber: '',
    email: ''
  };

  // Datos de Nequi
  nequiData = {
    phoneNumber: '',
    email: ''
  };

  paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: 'bi-credit-card',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'nequi',
      name: 'Nequi',
      icon: 'bi-phone',
      description: 'Pago rápido con tu celular'
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: 'bi-bank',
      description: 'Débito desde tu cuenta bancaria'
    },
    {
      id: 'cash',
      name: 'Efectivo',
      icon: 'bi-cash',
      description: 'Pago contra entrega'
    }
  ];

  banks = [
    'Bancolombia',
    'Banco de Bogotá',
    'BBVA',
    'Davivienda',
    'Banco Popular',
    'Banco Caja Social',
    'Banco AV Villas',
    'Banco Pichincha',
    'Banco Falabella'
  ];

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private pedidoManager: PedidoManagerService,
    private router: Router
  ) {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Recuperar datos del checkout
    const checkoutDataStr = sessionStorage.getItem('checkoutData');
    if (!checkoutDataStr) {
      console.error('No se encontraron datos de checkout');
      this.router.navigate(['/checkout-summary']);
      return;
    }
    this.checkoutData = JSON.parse(checkoutDataStr);
    console.log('📦 Datos del checkout recuperados:', this.checkoutData);

    // Obtener correo del usuario autenticado
    const usuario = this.authService.loggedUser();
    const userEmail = usuario?.correo || this.checkoutData.correo || '';
    console.log('📧 Correo del usuario:', userEmail);

    // Auto-llenar campos de correo electrónico
    this.nequiData.email = userEmail;
    this.pseData.email = userEmail;

    // Verificar que hay productos en el carrito
    const cartItems = this.carritoService.cartItems();
    if (cartItems.length === 0) {
      this.router.navigate(['/tienda']);
      return;
    }

    this.total.set(this.carritoService.getTotal());
  }

  selectPaymentMethod(methodId: string) {
    this.selectedPaymentMethod.set(methodId);
  }

  async processPayment() {
    if (!this.selectedPaymentMethod()) {
      alert('Por favor selecciona un método de pago');
      return;
    }

    // Validar datos según el método seleccionado
    if (!this.validatePaymentData()) {
      return;
    }

    this.isProcessingPayment.set(true);

    try {
      console.log('💳 Simulando procesamiento de pago...');
      // Simular procesamiento de pago
      await this.simulatePaymentProcess();

      console.log('✅ Pago simulado exitosamente, creando pedido...');
      
      // Crear el pedido después de "pagar"
      this.pedidoManager.procesarPedidoDesdeCarrito(
        this.checkoutData.direccion
      ).subscribe({
        next: (pedidoCreado) => {
          console.log('✅ Pedido creado exitosamente:', pedidoCreado);
          
          // Limpiar carrito y sessionStorage
          this.carritoService.limpiarCarritoCompleto();
          sessionStorage.removeItem('checkoutData');
          
          this.isProcessingPayment.set(false);
          
          // Redirigir a la página de pedidos del cliente directamente
          const clienteId = this.authService.loggedUser()?.id;
          if (clienteId) {
            this.router.navigate([`/cliente/${clienteId}/pedidos`], {
              queryParams: { pedidoCreado: pedidoCreado.id }
            });
          } else {
            this.router.navigate(['/tienda']);
          }
        },
        error: (error) => {
          console.error('❌ Error al crear el pedido:', error);
          this.isProcessingPayment.set(false);
          alert('Error al crear el pedido después del pago. Por favor contacta con soporte.');
        }
      });
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago. Por favor intenta de nuevo.');
      this.isProcessingPayment.set(false);
    }
  }

  private validatePaymentData(): boolean {
    const method = this.selectedPaymentMethod();

    switch (method) {
      case 'card':
        if (!this.cardData.number || !this.cardData.expiryMonth ||
            !this.cardData.expiryYear || !this.cardData.cvv ||
            !this.cardData.holderName) {
          alert('Por favor completa todos los datos de la tarjeta');
          return false;
        }
        break;

      case 'nequi':
        if (!this.nequiData.phoneNumber || !this.nequiData.email) {
          alert('Por favor completa los datos de Nequi');
          return false;
        }
        break;

      case 'pse':
        if (!this.pseData.bank || !this.pseData.documentNumber || !this.pseData.email) {
          alert('Por favor completa los datos de PSE');
          return false;
        }
        break;

      case 'cash':
        // No se requieren datos adicionales para efectivo
        break;

      default:
        alert('Método de pago no válido');
        return false;
    }

    return true;
  }

  private simulatePaymentProcess(): Promise<void> {
    return new Promise((resolve) => {
      // Simular diferentes tiempos según el método de pago
      const method = this.selectedPaymentMethod();
      let delay = 2000;
      
      if (method === 'pse') {
        delay = 3000; // PSE tarda más
      } else if (method === 'nequi') {
        delay = 1500; // Nequi es más rápido
      } else if (method === 'cash') {
        delay = 500; // Efectivo es instantáneo
      }
      
      console.log(`⏳ Simulando pago con ${method} (${delay}ms)...`);
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }

  goBack() {
    this.router.navigate(['/checkout-summary']);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getYearRange(): number[] {
    const currentYear = this.getCurrentYear();
    const years = [];
    for (let i = 0; i <= 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  }
}
