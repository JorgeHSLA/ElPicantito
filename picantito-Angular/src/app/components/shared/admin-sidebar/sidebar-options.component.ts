import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-options',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-options.component.html',
  styleUrls: ['./sidebar-options.component.css']
})
export class SidebarOptionsComponent {
  @Input() options: Array<{ label: string, icon?: string, route?: string }> = [];
}
