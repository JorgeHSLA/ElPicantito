import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recommended-product-card',
  templateUrl: './recommended-product-card.component.html',
  styleUrls: ['./recommended-product-card.component.css']
})
export class RecommendedProductCardComponent {
  @Input() producto: any;
}
