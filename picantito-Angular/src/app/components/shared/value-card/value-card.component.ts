import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-value-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './value-card.component.html',
  styleUrls: ['./value-card.component.css']
})
export class ValueCardComponent {
  @Input() value: any;
}
