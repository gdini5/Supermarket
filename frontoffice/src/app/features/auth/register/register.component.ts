import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, Validators, AbstractControl,
  ValidationErrors, ValidatorFn
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-card card">
        <h1>Criar conta</h1>
        <p class="auth-sub">Junte-se ao Marketplace</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Nome completo</label>
            <input type="text" formControlName="name" placeholder="Maria Silva">
            @if (f('name').touched && f('name').errors?.['required']) {
              <span class="error-msg">Nome obrigatório</span>
            }
            @if (f('name').touched && f('name').errors?.['minlength']) {
              <span class="error-msg">Mínimo 3 caracteres</span>
            }
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="email@exemplo.pt">
            @if (f('email').touched && f('email').errors?.['required']) {
              <span class="error-msg">Email obrigatório</span>
            }
            @if (f('email').touched && f('email').errors?.['email']) {
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
            @if (f('password').touched && f('password').errors?.['minlength']) {
              <span class="error-msg">Mínimo 6 caracteres</span>
            }
            @if (f('password').value) {
              <div class="strength-bar">
                <div class="strength-fill" [style.width]="strengthWidth" [class]="strengthClass"></div>
              </div>
              <span class="strength-label" [class]="strengthClass">{{ strengthLabel }}</span>
            }
          </div>

          <div class="form-group">
            <label>Confirmar password</label>
            <input [type]="showPass ? 'text' : 'password'" formControlName="confirmPassword" placeholder="••••••">
            @if (form.errors?.['passwordMismatch'] && f('confirmPassword').touched) {
              <span class="error-msg">As passwords não coincidem</span>
            }
          </div>

          <div class="form-group">
            <label>Morada</label>
            <input type="text" formControlName="address" placeholder="Rua Exemplo, 1, Lisboa">
            @if (f('address').touched && f('address').errors?.['required']) {
              <span class="error-msg">Morada obrigatória</span>
            }
          </div>

          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" formControlName="phone" placeholder="9XXXXXXXX">
            @if (f('phone').touched && f('phone').errors?.['pattern']) {
              <span class="error-msg">Formato inválido (9XXXXXXXX)</span>
            }
          </div>

          <div class="form-group">
            <label>Tipo de conta</label>
            <select formControlName="role">
              <option value="client">Cliente</option>
              <option value="courier">Estafeta</option>
            </select>
          </div>

          @if (f('role').value === 'courier') {
            <div class="form-group">
              <label>Veículo</label>
              <select formControlName="vehicle">
                <option value="bicycle">Bicicleta</option>
                <option value="motorcycle">Mota</option>
                <option value="car">Carro</option>
                <option value="foot">A pé</option>
              </select>
            </div>
          }

          @if (serverError) { <div class="alert alert-error">{{ serverError }}</div> }

          <button type="submit" class="btn btn-primary btn-full" [disabled]="isLoading">
            {{ isLoading ? 'A criar conta...' : 'Criar conta' }}
          </button>
        </form>

        <p class="auth-link">Já tem conta? <a routerLink="/auth/login">Iniciar sessão</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap {
      min-height: calc(100vh - 120px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem;
    }
    .auth-card { width: 100%; max-width: 480px; }
    .auth-card h1 { margin-bottom: .3rem; }
    .auth-sub { color: var(--text-2); margin-bottom: 1.5rem; font-size: .9rem; }
    .input-group { position: relative; }
    .input-group input { padding-right: 2.5rem; }
    .toggle-pass {
      position: absolute; right: .6rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 1rem; width: auto;
    }
    .strength-bar { height: 4px; background: var(--border); border-radius: 2px; margin-top: .4rem; }
    .strength-fill { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
    .strength-label { font-size: .75rem; }
    .weak   { background: var(--red); color: var(--red); }
    .medium { background: var(--amber); color: var(--amber); }
    .strong { background: var(--green); color: var(--green); }
    .btn-full { width: 100%; justify-content: center; padding: .7rem; font-size: 1rem; }
    .auth-link { text-align: center; color: var(--text-2); font-size: .88rem; margin-top: 1rem; }
  `]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  serverError = '';
  showPass = false;

  form = this.fb.group({
    name:            ['', [Validators.required, Validators.minLength(3)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    address:         ['', Validators.required],
    phone:           ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
    role:            ['client', Validators.required],
    vehicle:         ['bicycle']
  }, { validators: passwordMatchValidator });

  f(name: string): AbstractControl {
    return this.form.get(name)!;
  }

  get strengthScore(): number {
    const p = this.f('password').value ?? '';
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }
  get strengthClass(): string { return ['weak', 'weak', 'medium', 'strong', 'strong'][this.strengthScore]; }
  get strengthLabel(): string { return ['Fraca', 'Fraca', 'Razoável', 'Forte', 'Forte'][this.strengthScore]; }
  get strengthWidth(): string { return `${(this.strengthScore / 4) * 100}%`; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isLoading = true;
    this.serverError = '';
    const v = this.form.value;
    const payload: Record<string, string> = {
      name: v.name!, email: v.email!, password: v.password!,
      address: v.address!, phone: v.phone!, role: v.role!
    };
    if (v.role === 'courier' && v.vehicle) payload['vehicle'] = v.vehicle;

    this.auth.register(payload as Parameters<AuthService['register']>[0]).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.isLoading = false;
        this.serverError = err?.error?.message ?? 'Erro ao criar conta.';
      }
    });
  }
}
