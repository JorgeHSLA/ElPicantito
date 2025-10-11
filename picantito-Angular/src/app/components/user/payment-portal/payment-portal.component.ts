import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

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
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar que hay productos en el carrito
    const cartItems = this.cartService.getCartItems()();
    if (cartItems.length === 0) {
      this.router.navigate(['/tienda']);
      return;
    }

    this.total.set(this.cartService.getTotal());
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
      // Simular procesamiento de pago
      await this.simulatePaymentProcess();

      // Limpiar carrito después del pago exitoso
      this.cartService.clearCart();

      // Mostrar mensaje de éxito y redirigir al rastreo
      alert('¡Pago procesado exitosamente! Tu pedido ha sido confirmado.');
      this.router.navigate(['/rastreo-pedido']);    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
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
      setTimeout(() => {
        resolve();
      }, 3000); // Simular 3 segundos de procesamiento
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
