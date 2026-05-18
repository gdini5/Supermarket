import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

/**
 * Validador que confirma que o campo `confirm` é igual ao `password`.
 * Aplicado ao FormGroup (não ao control individual).
 */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pwd = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pwd && confirm && pwd !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
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
          <mat-card-title>Criar conta de cliente</mat-card-title>
          <mat-card-subtitle>Regista-te para começar a comprar nos supermercados locais</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline">
              <mat-label>Nome completo</mat-label>
              <input matInput formControlName="name" autocomplete="name" required>
              @if (form.controls.name.touched && form.controls.name.hasError('required')) {
                <mat-error>O nome é obrigatório.</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" required>
              @if (form.controls.email.touched && form.controls.email.hasError('required')) {
                <mat-error>O email é obrigatório.</mat-error>
              }
              @if (form.controls.email.touched && form.controls.email.hasError('email')) {
                <mat-error>Email inválido.</mat-error>
              }
            </mat-form-field>

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>Telefone</mat-label>
                <input matInput formControlName="phone" autocomplete="tel" inputmode="tel" required>
                @if (form.controls.phone.touched && form.controls.phone.hasError('required')) {
                  <mat-error>O telefone é obrigatório.</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Morada</mat-label>
                <input matInput formControlName="address" autocomplete="street-address" required>
                @if (form.controls.address.touched && form.controls.address.hasError('required')) {
                  <mat-error>A morada é obrigatória.</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="new-password" required>
              <mat-hint>Mínimo 6 caracteres</mat-hint>
              @if (form.controls.password.touched && form.controls.password.hasError('required')) {
                <mat-error>A password é obrigatória.</mat-error>
              }
              @if (form.controls.password.touched && form.controls.password.hasError('minlength')) {
                <mat-error>A password deve ter pelo menos 6 caracteres.</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirmar password</mat-label>
              <input matInput type="password" formControlName="confirm" autocomplete="new-password" required>
              @if (form.controls.confirm.touched && form.hasError('mismatch')) {
                <mat-error>As passwords não coincidem.</mat-error>
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
                <span>Criar conta</span>
              }
            </button>

            <p class="auth-footer">
              Já tens conta?
              <a routerLink="/login">Inicia sessão</a>
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
      max-width: 520px;
      padding: 0.5rem 0.5rem 1rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 0.75rem;
    }
    @media (max-width: 500px) {
      .row { grid-template-columns: 1fr; }
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
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.snack.open('Conta criada com sucesso! Bem-vindo.', 'OK', { duration: 3500 });
        this.router.navigateByUrl('/');
      },
      error: err => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.error ?? 'Não foi possível criar a conta.');
      },
    });
  }
}
