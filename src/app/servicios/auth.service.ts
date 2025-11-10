import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/usuarios';

  constructor(private http: HttpClient) {}

  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario, {
    headers: { 'Content-Type': 'application/json' }});
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      })
    );
  }

  obtenerPedidos(idUsuario: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/${idUsuario}/pedidos`, { headers });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsuarioLogueado() {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }
}
