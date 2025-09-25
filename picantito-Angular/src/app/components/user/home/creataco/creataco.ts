import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creataco',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creataco.html',
  styleUrls: ['./creataco.css']
})
export class CreatacoComponent {
  
  constructor(private router: Router) {}

  navigateToBuilder(): void {
    // Aquí navegaríamos al constructor de tacos cuando esté implementado
    // Por ahora, redirigir a la tienda
    this.router.navigate(['/tienda']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}