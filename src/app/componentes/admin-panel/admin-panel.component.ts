import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent {
  producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    url_imagen: ''
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearProducto() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:4000/api/productos', this.producto, { headers })
      .subscribe({
        next: () => {
          alert('Producto agregado correctamente');
          this.producto = { nombre: '', descripcion: '', precio: 0, url_imagen: '' };
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          alert('Error al agregar producto');
        }
      });
  }
}
