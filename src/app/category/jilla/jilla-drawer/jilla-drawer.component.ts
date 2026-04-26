import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-jilla-drawer',
  templateUrl: './jilla-drawer.component.html',
  styleUrls: ['./jilla-drawer.component.scss']
})
export class JillaDrawerComponent {
  @Input() jilla: any = null;
  @Input() open = false;
  @Output() closeDrawer = new EventEmitter<void>();

  getColor(name: string = ''): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 70%, 85%)`;
  }
}
