import { Component, OnInit, AfterViewInit, computed, inject } from '@angular/core';
import { loadScript, PayPalNamespace } from '@paypal/paypal-js';
import { CarritoService } from '../../servicios/carrito.service';
import { PedidoService } from '../../servicios/pedido.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.css'],
  providers: [CurrencyPipe]
})
export class CarritoComponent implements OnInit, AfterViewInit {
  private carritoService = inject(CarritoService);
  private pedidoService = inject(PedidoService);

  carrito = this.carritoService.productos;
  total = computed(() => Number(this.carritoService.total()));

  ngOnInit() {
    console.log('🛒 Carrito cargado:', this.carrito());
  }

  async ngAfterViewInit() {
    const paypal: PayPalNamespace | null = await loadScript({
      clientId: 'AXbjKFKHiwJjEKqQ2NmnX6MktGdYZmWBIdrCBvIu2FDh5W47zOAp3purOyAxvDt3vYvAy9FNMSGnX737',
      currency: 'USD'
    });

    if (!paypal || typeof paypal.Buttons !== 'function') {
      console.error('❌ No se pudo inicializar PayPal.');
      return;
    }

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.total().toString()
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const detalles = await actions.order?.capture();
        console.log('✅ Pago completado:', detalles);

        this.pedidoService.guardarPedido(this.carrito(), this.total()).subscribe({
          next: () => {
            alert('Pedido registrado correctamente');
            this.carritoService.vaciar();
          },
          error: (err) => console.error('Error al registrar pedido:', err)
        });
      },
      onError: (err) => {
        console.error('⚠️ Error con PayPal:', err);
      }
    }).render('#paypal-button-container');
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }
}
