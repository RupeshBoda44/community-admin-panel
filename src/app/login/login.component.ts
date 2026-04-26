import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mobile = '';
  loading = false;
  error = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.mobile.length !== 10) {
      this.error = 'Please enter a valid 10-digit mobile number';
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.sendOTP(this.mobile).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/verify-otp'], { queryParams: { mobile: this.mobile } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to send OTP. Please try again.';
      }
    });
  }
}
