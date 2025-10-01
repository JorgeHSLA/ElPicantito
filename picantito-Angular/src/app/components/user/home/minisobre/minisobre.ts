import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minisobre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minisobre.html',
  styleUrls: ['./minisobre.css']
})
export class MinisobreComponent {
  
  constructor(private router: Router) {}

  navigateToAbout(): void {
    this.router.navigate(['/sobre-nosotros']).then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}