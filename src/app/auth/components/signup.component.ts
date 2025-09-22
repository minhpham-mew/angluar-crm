import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import * as AuthActions from '../store/auth.actions';
import { selectAuthError, selectAuthLoading } from '../store/auth.selectors';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): Record<string, any> | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    CardModule,
  ],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  signupForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password, companyName } = this.signupForm.value;
      this.store.dispatch(
        AuthActions.signup({
          name,
          email,
          password,
          companyName,
        }),
      );
    }
  }
}
