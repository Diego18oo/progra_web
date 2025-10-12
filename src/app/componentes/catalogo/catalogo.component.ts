import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CatalogoService } from '../../servicios/catalogo.service';

@Component({
  selector: 'app-catalogo',
  standalone: true, // 👈 si tu componente es standalone (Angular 17+)
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];

  constructor(private catalogoService: CatalogoService) {}

  ngOnInit(): void {
    // Cuando se carga el componente, obtiene los productos del backend
    this.catalogoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos obtenidos:', this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }
}
