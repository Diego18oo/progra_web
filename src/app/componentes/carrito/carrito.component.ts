import { Component, computed, inject } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './carrito.component.html',
  providers: [CurrencyPipe] 
})
export class CarritoComponent {
  private carritoService = inject(CarritoService);
  private currency = inject(CurrencyPipe);

  carrito = this.carritoService.productos;
  total = computed(() => this.carritoService.total());

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
