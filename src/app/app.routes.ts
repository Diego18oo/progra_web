import { Routes } from '@angular/router';
import { CatalogoComponent } from './componentes/catalogo/catalogo.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { LoginComponent } from './componentes/perfil/login/login.component';
import { RegistroComponent } from './componentes/perfil/registro/registro.component';
import { AdminPanelComponent } from './componentes/admin-panel/admin-panel.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';


export const routes: Routes = [
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'perfil', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'recuperar', component: RecuperarPasswordComponent }
];
