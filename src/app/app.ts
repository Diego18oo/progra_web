import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header style="display:flex; justify-content:space-between; align-items:center; background:#f3f3f3; padding:10px 20px;">
      <h1>🧀 Quesería de Mi Sin Ti</h1>

      <nav>
        <a routerLink="/catalogo" style="margin-right: 15px; text-decoration:none; color:#333;">Catálogo</a>
        <a routerLink="/carrito" style="text-decoration:none; color:#333;">Carrito 🛒</a>
      </nav>
    </header>

    <main style="padding: 20px;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
