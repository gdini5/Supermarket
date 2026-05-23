import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Bem-vindo de volta</mat-card-title>
          <mat-card-subtitle>Entra na tua conta para continuar a comprar</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" required>
              <mat-icon matSuffix>mail</mat-icon>
              @if (form.controls.email.touched && form.controls.email.hasError('required')) {
                <mat-error>O email é obrigatório.</mat-error>
              }
              @if (form.controls.email.touched && form.controls.email.hasError('email')) {
                <mat-error>Email inválido.</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                required>
              <button
                type="button"
                mat-icon-button
                matSuffix
                (click)="showPassword.set(!showPassword())"
                [attr.aria-label]="showPassword() ? 'Ocultar password' : 'Mostrar password'">
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.controls.password.touched && form.controls.password.hasError('required')) {
                <mat-error>A password é obrigatória.</mat-error>
              }
            </mat-form-field>

            @if (errorMsg()) {
              <div class="auth-error">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMsg() }}</span>
              </div>
            }

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="submit-btn"
              [disabled]="loading() || form.invalid">
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                <span>Entrar</span>
              }
            </button>

            <p class="auth-footer">
              Ainda não tens conta?
              <a routerLink="/register">Cria uma agora</a>
            </p>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 64px);
      padding: 2rem 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 0.5rem 0.5rem 1rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .submit-btn {
      height: 44px;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auth-error {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      border-radius: 4px;
      font-size: 0.9rem;
      align-items: center;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
      a { font-weight: 500; }
    }
  `],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly showPassword = signal(false);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.error ?? 'Não foi possível iniciar sessão.');
      },
    });
  }
}
