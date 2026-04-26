import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sub-cast-drawer',
  templateUrl: './sub-cast-drawer.component.html',
  styleUrls: ['./sub-cast-drawer.component.scss']
})
export class SubCastDrawerComponent {
  @Input() subCast: any = null;
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
