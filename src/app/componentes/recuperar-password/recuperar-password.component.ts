import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.component.html',
})
export class RecuperarPasswordComponent {
  correo = '';
  nuevaPassword: string | null = null;
  mensajeError = '';

  constructor(private http: HttpClient) {}

  recuperar() {
    this.http.post('http://localhost:4000/api/usuarios/recuperar', { correo: this.correo })
      .subscribe({
        next: (resp: any) => {
          this.nuevaPassword = resp.nuevaPassword;
          this.mensajeError = '';
        },
        error: (err) => {
          console.error(err);
          this.mensajeError = err.error?.error || 'Error al recuperar la contraseña';
        }
      });
  }
}
