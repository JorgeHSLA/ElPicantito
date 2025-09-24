import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommended-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommended-product-card.component.html',
  styleUrls: ['./recommended-product-card.component.css']
})
export class RecommendedProductCardComponent {
  @Input() producto: any;
}
