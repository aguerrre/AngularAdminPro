import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { RegisterForm } from 'src/app/interfaces/register-form.interface';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css'
  ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    c_password: ['', [Validators.required]],
    terms: [false, [Validators.required]],
  },
    {
      validators: this.passwordsEquals('password', 'c_password')
    }
  );

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  createUser() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    } else {
      let registerFormI: RegisterForm = this.registerForm.value;
      this.userService.create(registerFormI).subscribe({
        next: (resp) => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          Toast.fire({ icon: 'error', text: err.error.msg, title: 'Error' });
        }
      });
    }
  }

  notValidField(field: string): boolean {
    return this.registerForm.get(field)?.invalid && this.formSubmitted ? true : false;
  }

  notValidPass(): boolean {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('c_password')?.value;

    return pass1 !== pass2 && this.formSubmitted ? true : false;
  }

  acceptTerms(): boolean {
    return !this.registerForm.get('terms')?.value && this.formSubmitted;
  }

  passwordsEquals(password: string, c_password: string) {
    return (control: AbstractControl) => {
      const pass1Control = control.get(password);
      const pass2Control = control.get(c_password);

      if (password === null || c_password === null) {
        return null;
      }
      if (pass1Control?.value !== pass2Control?.value) {
        pass2Control?.setErrors({ notEquals: true });
        return ({ notEquals: true });
      } else {
        pass2Control?.setErrors(null);
        return null;
      }
    }
  }

}
