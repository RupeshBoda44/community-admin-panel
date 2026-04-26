import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  collapsed = false;
  categoryOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.categoryOpen = this.router.url.includes('/category');
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.categoryOpen = e.url.includes('/category');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
