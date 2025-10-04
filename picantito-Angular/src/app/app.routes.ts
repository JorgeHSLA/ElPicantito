import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

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
    loadComponent: () => import('./components/user/mi-perfil/mi-perfil').then(m => m.MiPerfilComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () => import('./components/user/sobre-nosotros/sobre-nosotros').then(m => m.SobreNosotrosComponent)
  },
  {
    path: 'checkout-summary',
    loadComponent: () => import('./components/user/checkout-summary/checkout-summary.component').then(m => m.CheckoutSummaryComponent)
  },
  {
    path: 'payment-portal',
    loadComponent: () => import('./components/user/payment-portal/payment-portal.component').then(m => m.PaymentPortalComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'rastreo-pedido',
    loadComponent: () => import('./components/user/rastreo-pedido/rastreo-pedido.component').then(m => m.RastreoPedidoComponent),
    canActivate: [AuthGuard]
  },
  // Rutas de administración
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./components/admin/productos/productos').then(m => m.ProductosComponent)
      },
      {
        path: 'productos/edit/:id',
        loadComponent: () => import('./components/admin/edit-producto/edit-producto').then(m => m.EditProductoComponent)
      },
      {
        path: 'adicionales',
        loadComponent: () => import('./components/admin/adicionales/adicionales').then(m => m.AdicionalesComponent)
      },
      {
        path: 'adicionales/edit/:id',
        loadComponent: () => import('./components/admin/edit-adicional/edit-adicional').then(m => m.EditAdicionalComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/admin/usuarios/usuarios').then(m => m.UsuariosComponent)
      },
      {
        path: 'usuarios/edit/:id',
        loadComponent: () => import('./components/admin/edit-usuario/edit-usuario').then(m => m.EditUsuarioComponent)
      }
    ]
  }
];
