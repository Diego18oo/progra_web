import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CatalogoService } from '../../servicios/catalogo.service';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  private catalogoService = inject(CatalogoService);
  private carritoService = inject(CarritoService);

  productos: any[] = [];

  ngOnInit(): void {
    this.catalogoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregar(producto);
    alert(`${producto.nombre} agregado al carrito `);
  }
}
