import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  


@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './restablecer-password.component.html'
})
export class RestablecerPasswordComponent {
  token = '';
  nuevaContrasena = '';
  mensaje = '';
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  enviar() {
    this.http.post('http://localhost:4000/api/usuarios/restablecer', {
      token: this.token,
      nuevaContrasena: this.nuevaContrasena
    })
    .subscribe({
      next: (resp: any) => {
        this.mensaje = resp.mensaje;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al cambiar contraseña';
      }
    });
  }
}
