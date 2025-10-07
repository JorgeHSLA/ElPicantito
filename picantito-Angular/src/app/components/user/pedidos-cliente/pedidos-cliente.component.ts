import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PedidoRestService, PedidoDto } from '../../../services/tienda/pedido-rest.service';

@Component({
  selector: 'app-pedidos-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-cliente.component.html',
  styleUrls: ['./pedidos-cliente.component.css']
})
export class PedidosClienteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pedidoService = inject(PedidoRestService);

  pedidos = signal<PedidoDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('clienteId'));
    if (!id) {
      this.error.set('ID de cliente inválido');
      this.loading.set(false);
      return;
    }
    this.pedidoService.getByCliente(id).subscribe({
      next: (data) => {
        this.pedidos.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudieron cargar los pedidos');
        this.loading.set(false);
      }
    });
  }
}
