import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-announcement-drawer',
  templateUrl: './announcement-drawer.component.html',
  styleUrls: ['./announcement-drawer.component.scss']
})
export class AnnouncementDrawerComponent {
  @Input() announcement: any = null;
  @Input() open = false;
  @Output() closeDrawer = new EventEmitter<void>();
}
