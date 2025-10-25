import { Routes } from '@angular/router';
import { CatalogoComponent } from './componentes/catalogo/catalogo.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { LoginComponent } from './componentes/perfil/login/login.component';
import { RegistroComponent } from './componentes/perfil/registro/registro.component';

export const routes: Routes = [
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'perfil', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' }
];
