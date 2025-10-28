import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  credenciales = {
    correo: '',
    contrasena: ''
  };

  usuario: any = null;
  pedidos: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Si el usuario ya está logueado, cargamos su info automáticamente
    const usuarioGuardado = this.authService.getUsuarioLogueado();
    if (usuarioGuardado) {
      this.usuario = usuarioGuardado;
      this.cargarPedidos();
    }
  }

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

  logout() {
    this.authService.logout();
    this.usuario = null;
    this.pedidos = [];
    alert('Sesión cerrada correctamente');
  }
}
