import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from './user-drawer/user-drawer.component';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';

  selectedUser: User | null = null;
  drawerOpen = false;

  currentPage = 1;
  perPage = 10;
  total = 0;
  searchQuery = '';
  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 1;
      this.loadUsers();
    });
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    this.userService.getUsers(this.currentPage, this.perPage, this.searchQuery).subscribe({
      next: (res) => {
        this.loading = false;
        this.users = res?.data ?? [];
        const pagination = res?._metadata?.pagination;
        if (pagination) {
          this.total       = pagination.total;
          this.currentPage = pagination.page;
          this.perPage     = pagination.perPage;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load users.';
      }
    });
  }

  onSearch() { this.searchSubject.next(this.searchQuery); }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.perPage     = event.pageSize;
    this.loadUsers();
  }

  getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 70%, 85%)`;
  }

  openDrawer(user: any) {
    this.selectedUser = user;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
    setTimeout(() => this.selectedUser = null, 300);
  }
}
