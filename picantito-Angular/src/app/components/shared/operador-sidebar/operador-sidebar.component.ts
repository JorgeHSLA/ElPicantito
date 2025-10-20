import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operador-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operador-sidebar.html',
  styleUrls: ['./operador-sidebar.css']
})
export class OperadorSidebarComponent {
}
