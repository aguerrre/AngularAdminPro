import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from 'src/app/services/user.service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
  ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [localStorage.getItem('email') ? true : false],
  },
  );

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.googleButtonInit();
  }

  googleButtonInit() {
    google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  notValidField(field: string): boolean {
    return this.loginForm.get(field)?.invalid && this.formSubmitted ? true : false;
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.userService.login(this.loginForm.value).subscribe({
        next: resp => {
          this.loginForm.get('remember')?.value ?
            localStorage.setItem('email', this.loginForm.get('email')?.value!) :
            localStorage.removeItem('email');
          this.router.navigateByUrl('/');
        },
        error: err => {
          Toast.fire({ icon: 'error', text: err.error.msg, title: 'Error' });
        }
      });
    }
  }

}
