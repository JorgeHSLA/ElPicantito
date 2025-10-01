import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.html',
  styleUrls: ['./searchbar.css']
})
export class SearchbarComponent {
  searchQuery: string = '';

  constructor() {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Búsqueda:', this.searchQuery.trim());
      // Aquí se implementaría la lógica de búsqueda
      // Por ejemplo, navegar a página de resultados o filtrar productos
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}