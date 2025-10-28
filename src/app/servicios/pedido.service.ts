import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:4000/api/pedidos';

  constructor(private http: HttpClient) {}

  guardarPedido(productos: Producto[], total: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    console.log("🔑 Token que se enviará:", token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // ✅ enviamos el token al backend
    });

    return this.http.post(this.apiUrl, { productos, total }, { headers });
  }
}
