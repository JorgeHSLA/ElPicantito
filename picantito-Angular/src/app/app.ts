import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = signal('picantito-angular');
  
  // Controlar si mostrar navbar y footer principal
  showMainNavbar = true;
  showFooter = true;

  // Rutas donde NO queremos mostrar el navbar principal
  private authRoutes = ['/login', '/registry'];

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateLayoutVisibility(event.url);
      });

    // Verificar ruta inicial
    this.updateLayoutVisibility(this.router.url);
  }

  private updateLayoutVisibility(url: string): void {
    // Verificar si la URL actual está en las rutas de autenticación
    this.showMainNavbar = !this.authRoutes.some(route => url.startsWith(route));
    this.showFooter = !this.authRoutes.some(route => url.startsWith(route));
  }
}
