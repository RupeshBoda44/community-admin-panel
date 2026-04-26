import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';

export interface User {
  name: string;
  phone: string;
  active: boolean;
  color: string;
}

@Component({
  selector: 'app-user-drawer',
  templateUrl: './user-drawer.component.html',
  styleUrls: ['./user-drawer.component.scss']
})
export class UserDrawerComponent {
  @Input() user:any;
  @Input() open = false;
  @Output() closeDrawer = new EventEmitter<void>();
  verifyingId: string | null = null;
  showConfirm = false;

  constructor(private userService: UserService) {}

  openConfirm() {
    if (this.verifyingId) return;
    this.showConfirm = true;
  }

  confirmAction(action: 'verified' | 'unverified') {
    this.showConfirm = false;
    const user = this.user;
    this.verifyingId = user._id;
    const call = action === 'verified'
      ? this.userService.verifyUser(user._id)
      : this.userService.unverifyUser(user._id);
    call.subscribe({
      next: () => {
        user.verified = action === 'verified';
        this.verifyingId = null;
      },
      error: () => { this.verifyingId = null; }
    });
  }

}
