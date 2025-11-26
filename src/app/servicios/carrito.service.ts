import { Injectable, signal } from '@angular/core';
import { Producto } from '../modelos/producto';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private productosSignal = signal<Array<Producto & { cantidad: number }>>([]);
  productos = this.productosSignal.asReadonly();

  agregar(producto: Producto) {
    this.productosSignal.update(lista => {
      const existente = lista.find(p => p.id === producto.id);

      if (existente) {
        if (existente.cantidad >= producto.stock) {
          alert("No puedes agregar más, no hay suficiente stock.");
          return lista;
        }

        return lista.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      if (producto.stock <= 0) {
        alert("Este producto está agotado.");
        return lista;
      }

      return [...lista, { ...producto, cantidad: 1 }];
    });
  }

  quitar(id: number) {
    this.productosSignal.update(lista => lista.filter(p => p.id !== id));
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total() {
    return this.productosSignal().reduce(
      (acc, p) => acc + (Number(p.precio) * p.cantidad),
      0
    );
  }

  exportarXML() {
    const productos = this.productosSignal();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;

    for (const p of productos) {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${p.nombre}</nombre>\n`;
      xml += `    <precio>${p.precio}</precio>\n`;
      xml += `    <cantidad>${p.cantidad}</cantidad>\n`;
      if (p.descripcion) {
        xml += `    <descripcion>${p.descripcion}</descripcion>\n`;
      }
      xml += `  </producto>\n`;
    }

    xml += `  <total>${this.total()}</total>\n`;
    xml += `</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    URL.revokeObjectURL(url);
  }

  incrementar(id: number) {
    this.productosSignal.update(lista =>
      lista.map(p => {
        if (p.id === id) {
          if (p.cantidad >= p.stock) {
            alert("Has alcanzado el límite de stock disponible.");
            return p; 
          }
          return { ...p, cantidad: p.cantidad + 1 };
        }
        return p;
      })
    );
  }

  decrementar(id: number) {
    this.productosSignal.update(lista => {
      return lista
        .map(p =>
          p.id === id
            ? { ...p, cantidad: Math.max(1, p.cantidad - 1) }
            : p
        )
        .filter(p => p.cantidad > 0); 
    });
  }
}
