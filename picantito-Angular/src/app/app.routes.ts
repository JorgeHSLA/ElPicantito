import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/user/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/user/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registry',
    loadComponent: () => import('./components/user/registry/registry').then(m => m.RegistryComponent)
  },
  {
    path: 'tienda',
    loadComponent: () => import('./components/user/tienda/tienda').then(m => m.TiendaComponent)
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./components/user/mi-perfil/mi-perfil').then(m => m.MiPerfilComponent)
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () => import('./components/user/sobre-nosotros/sobre-nosotros').then(m => m.SobreNosotrosComponent)
  }
];
