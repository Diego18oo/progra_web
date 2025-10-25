import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../servicios/auth.service';
import { RouterModule } from '@angular/router';  // 👈 importa RouterModule


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  credenciales = {
    correo: '',
    contrasena: ''
  };

  usuario: any = null;
  pedidos: any[] = [];

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        this.usuario = res.usuario;
        alert('Bienvenido, ' + this.usuario.nombre);
        this.cargarPedidos();
      },
      error: (err) => console.error('Error al iniciar sesión:', err)
    });
  }

  cargarPedidos() {
    if (this.usuario) {
      this.authService.obtenerPedidos(this.usuario.id_usuario).subscribe({
        next: (data) => (this.pedidos = data),
        error: (err) => console.error('Error al cargar pedidos:', err)
      });
    }
  }
}
