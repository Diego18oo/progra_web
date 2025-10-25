import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    correo: '',
    contrasena: '',
    direccion: '',
    telefono: ''
  };

  constructor(private authService: AuthService) {}

  registrar() {
    console.log('Enviando al backend:', this.usuario);
    this.authService.registrar(this.usuario).subscribe({
      next: (res) => {
        alert('✅ Usuario registrado correctamente');
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
      }
    });
  }
}
