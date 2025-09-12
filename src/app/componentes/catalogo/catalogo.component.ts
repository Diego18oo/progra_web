// src/app/componentes/catalogo/catalogo.component.ts
import { Component, inject } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { ProductoService } from '../../servicios/producto.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { Producto } from '../../modelos/producto';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CarritoComponent, CommonModule],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent {
  private carritoService = inject(CarritoService);
  private productoService = inject(ProductoService);

  productos: Producto[] = [];

  constructor() {
    this.cargarProductos();
  }

  async cargarProductos() {
    this.productos = await this.productoService.getProductos();
  }

  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}
