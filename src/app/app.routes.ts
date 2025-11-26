import { Routes } from '@angular/router';
import { CatalogoComponent } from './componentes/catalogo/catalogo.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { LoginComponent } from './componentes/perfil/login/login.component';
import { RegistroComponent } from './componentes/perfil/registro/registro.component';
import { AdminPanelComponent } from './componentes/admin-panel/admin-panel.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { AvisoPrivacidadComponent } from './componentes/aviso-privacidad/aviso-privacidad.component';
import { TerminosCondicionesComponent } from './componentes/terminos-condiciones/terminos-condiciones.component';



export const routes: Routes = [
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'perfil', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'recuperar', component: RecuperarPasswordComponent },
  {
    path: 'restablecer-password',
    loadComponent: () =>
      import('./componentes/restablecer-password/restablecer-password.component')
        .then(c => c.RestablecerPasswordComponent)
  },
  { path: 'aviso-privacidad', component: AvisoPrivacidadComponent },
  { path: 'terminos-condiciones', component: TerminosCondicionesComponent }
];
