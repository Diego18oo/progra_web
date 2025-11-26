import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './servicios/auth.service';
import { FooterComponent } from './componentes/footer/footer.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FooterComponent],
  template: `
    <header style="display:flex; justify-content:space-between; align-items:center; background:#f3f3f3; padding:10px 20px;">
      <h1>🧀 Quesería de Mi Sin Ti</h1>

      <nav>
        <a routerLink="/perfil" style="margin-right: 15px; text-decoration:none; color:#333;">Mi Cuenta</a>
        <a routerLink="/catalogo" style="margin-right: 15px; text-decoration:none; color:#333;">Catálogo</a>
        <a routerLink="/carrito" style="text-decoration:none; color:#333;">Carrito 🛒</a>
      </nav>

      <nav class="navbar">
        <a *ngIf="usuario?.rol === 'cliente'" routerLink="/pedidos">Mis pedidos</a>
        <a *ngIf="usuario?.rol === 'admin'" routerLink="/admin-panel">Panel de Administración</a>
        <a *ngIf="usuario" (click)="logout()">Cerrar sesión</a>
      </nav>
    </header>

    <main style="padding: 20px;">
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    </main>
  `,
})
export class AppComponent implements OnInit {
  usuario: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Cargamos el usuario desde localStorage (si existe)
    this.usuario = this.authService.getUsuarioLogueado();
  }

  logout() {
    this.authService.logout();
    this.usuario = null;
    alert('Sesión cerrada correctamente');
    this.router.navigate(['/']);
  }
}
