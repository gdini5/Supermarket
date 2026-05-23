import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-card card">
        <h1>Iniciar sessão</h1>
        <p class="auth-sub">Bem-vindo de volta ao Marketplace</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="email@exemplo.pt">
            @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
              <span class="error-msg">Email obrigatório</span>
            }
            @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
              <span class="error-msg">Email inválido</span>
            }
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-group">
              <input [type]="showPass ? 'text' : 'password'" formControlName="password" placeholder="••••••">
              <button type="button" class="toggle-pass" (click)="showPass = !showPass">
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
            @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
              <span class="error-msg">Password obrigatória</span>
            }
            @if (form.get('password')?.touched && form.get('password')?.errors?.['minlength']) {
              <span class="error-msg">Mínimo 6 caracteres</span>
            }
          </div>

          @if (serverError) { <div class="alert alert-error">{{ serverError }}</div> }

          <button type="submit" class="btn btn-primary btn-full" [disabled]="isLoading">
            {{ isLoading ? 'A entrar...' : 'Entrar' }}
          </button>
        </form>

        <p class="auth-link">Não tem conta? <a routerLink="/auth/register">Registar-se</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap {
      min-height: calc(100vh - 120px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem;
    }
    .auth-card { width: 100%; max-width: 420px; }
    .auth-card h1 { margin-bottom: .3rem; }
    .auth-sub { color: var(--text-2); margin-bottom: 1.5rem; font-size: .9rem; }
    .input-group { position: relative; }
    .input-group input { padding-right: 2.5rem; }
    .toggle-pass {
      position: absolute; right: .6rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 1rem; width: auto;
    }
    .btn-full { width: 100%; justify-content: center; padding: .7rem; font-size: 1rem; }
    .auth-link { text-align: center; color: var(--text-2); font-size: .88rem; margin-top: 1rem; }
  `]
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private returnUrl = '/';
  isLoading = false;
  serverError = '';
  showPass = false;

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
    if (this.auth.isLoggedIn()) this.router.navigate([this.returnUrl]);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.serverError = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: err => {
        this.isLoading = false;
        this.serverError = err?.error?.message ?? 'Credenciais inválidas.';
      }
    });
  }
}
