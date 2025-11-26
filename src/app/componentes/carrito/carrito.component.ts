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
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      alert('Por favor inicia sesión antes de realizar un pago.');
      window.location.href = '/perfil';
      return;
    }
    console.log(usuario);
    console.log('Carrito cargado:', this.carrito());
  }

  async ngAfterViewInit() {
    const paypal: PayPalNamespace | null = await loadScript({
      clientId: 'AXbjKFKHiwJjEKqQ2NmnX6MktGdYZmWBIdrCBvIu2FDh5W47zOAp3purOyAxvDt3vYvAy9FNMSGnX737',
      currency: 'MXN'
    });

    if (!paypal || typeof paypal.Buttons !== 'function') {
      console.error('No se pudo inicializar PayPal.');
      return;
    }

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'MXN',
                value: this.total().toString()
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const detalles = await actions.order?.capture();
        console.log('Pago completado:', detalles);
        console.log('Token actual:', localStorage.getItem('token'));

        this.pedidoService.guardarPedido(this.carrito(), this.total()).subscribe({
          next: (res) => {
            alert(`Pedido #${res.id_pedido} registrado correctamente`);
            this.carritoService.vaciar();
          },
          error: (err) => console.error('Error al registrar pedido:', err)
        });
      },
      onError: (err) => {
        console.error('Error con PayPal:', err);
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

  incrementar(id: number) {
    this.carritoService.incrementar(id);
  }

  decrementar(id: number) {
    this.carritoService.decrementar(id);
  }
}
