import { Routes } from '@angular/router';
import { Home } from './components/user/home/home';
import { Adicionales } from './components/admin/adicionales/adicionales';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { Usuarios } from './components/admin/usuarios/usuarios';
import { Productos } from './components/admin/productos/productos';
import { EditUsuario } from './components/admin/edit-usuario/edit-usuario';
import { EditProducto } from './components/admin/edit-producto/edit-producto';
import { EditAdicional } from './components/admin/edit-adicional/edit-adicional';
import { Tienda } from './components/user/tienda/tienda';
import { SobreNosotros } from './components/user/sobre-nosotros/sobre-nosotros';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'adicionales', component: Adicionales},
    {path: 'dashboard', component: Dashboard},
    {path: 'edit-adicional', component: EditAdicional},
    {path: 'edit-producto', component: EditProducto},
    {path: 'edit-usuario', component: EditUsuario},
    {path: 'productos', component: Productos},
    {path: 'usuarios', component: Usuarios},
    {path: 'tienda', component: Tienda},
    {path: 'sobre-nosotros', component: SobreNosotros},

    
];
