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
      next: (data) => {
        this.productos = data.map((p: any) => ({
          id: p.id_producto,   
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          url_imagen: p.url_imagen,
          stock: p.stock
        }));
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  agregarAlCarrito(producto: any) {
    if (producto.stock <= 0) {
      alert(`El producto "${producto.nombre}" está agotado`);
      return;
    }

    this.carritoService.agregar(producto);
    alert(`${producto.nombre} agregado al carrito`);
  }
}
