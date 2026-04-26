import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpValue = '';
  mobile = '';
  loading = false;
  error = '';
  timer = 30;
  canResend = false;
  private interval: any;

  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputStyles: {
      'width': '48px',
      'height': '56px',
      'font-size': '22px',
      'font-weight': '700',
      'border-radius': '14px',
      'border': '2px solid #e5e7eb',
      'background': '#f9fafb',
      'color': '#1a1a2e'
    }
  };

  constructor(public router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => this.mobile = p['mobile'] || '');
    this.startTimer();
  }

  onOtpChange(otp: string) {
    this.otpValue = otp;
    this.error = '';
  }

  startTimer() {
    this.timer = 30;
    this.canResend = false;
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) { clearInterval(this.interval); this.canResend = true; }
    }, 1000);
  }

  verify() {
    if (this.otpValue.length < 6) { this.error = 'Please enter the 6-digit OTP'; return; }
    this.loading = true;
    this.error = '';

    this.authService.verifyOTP(this.mobile, this.otpValue).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.token) localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid OTP. Please try again.';
      }
    });
  }

  resend() {
    if (!this.canResend) return;
    this.otpValue = '';
    this.authService.sendOTP(this.mobile).subscribe({
      next: () => this.startTimer(),
      error: (err) => {
        this.error = err?.error?.message || 'Failed to resend OTP. Please try again.';
      }
    });
  }

  ngOnDestroy() { clearInterval(this.interval); }
}
