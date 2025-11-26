import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.component.html'
})
export class RecuperarPasswordComponent {
  correo = '';
  mensaje = '';
  error = '';

  constructor(private http: HttpClient) {}

  enviarCorreo() {
    this.mensaje = '';
    this.error = '';

    this.http.post('http://localhost:4000/api/usuarios/recuperar', { correo: this.correo })
      .subscribe({
        next: (data: any) => this.mensaje = data.mensaje,
        error: err => this.error = err.error?.error || 'Error desconocido'
      });
  }
}
