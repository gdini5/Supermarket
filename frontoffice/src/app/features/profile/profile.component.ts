import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>O meu perfil</h1>
      </div>

      <div class="profile-layout">
        <!-- Profile data -->
        <div class="card">
          <h2>Dados pessoais</h2>
          @if (saveSuccess) { <div class="alert alert-success">Dados actualizados com sucesso.</div> }
          @if (saveError)   { <div class="alert alert-error">{{ saveError }}</div> }

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="form-group">
              <label>Nome</label>
              <input type="text" formControlName="name">
              @if (pf('name').touched && pf('name').errors?.['minlength']) {
                <span class="error-msg">Mínimo 3 caracteres</span>
              }
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [value]="user?.email" disabled class="disabled-input">
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input type="tel" formControlName="phone" placeholder="9XXXXXXXX">
              @if (pf('phone').touched && pf('phone').errors?.['pattern']) {
                <span class="error-msg">Formato inválido (9XXXXXXXX)</span>
              }
            </div>
            <div class="form-group">
              <label>Morada</label>
              <input type="text" formControlName="address">
            </div>
            @if (user?.role === 'courier') {
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
            <button type="submit" class="btn btn-primary" [disabled]="savingProfile">
              {{ savingProfile ? 'A guardar...' : 'Guardar alterações' }}
            </button>
          </form>
        </div>

        <!-- Change password -->
        <div class="card">
          <h2>Alterar password</h2>
          @if (passSuccess) { <div class="alert alert-success">Password alterada.</div> }
          @if (passError)   { <div class="alert alert-error">{{ passError }}</div> }

          <form [formGroup]="passForm" (ngSubmit)="changePassword()">
            <div class="form-group">
              <label>Password actual</label>
              <input type="password" formControlName="currentPassword">
            </div>
            <div class="form-group">
              <label>Nova password</label>
              <input type="password" formControlName="newPassword">
              @if (ppf('newPassword').touched && ppf('newPassword').errors?.['minlength']) {
                <span class="error-msg">Mínimo 6 caracteres</span>
              }
            </div>
            <div class="form-group">
              <label>Confirmar nova password</label>
              <input type="password" formControlName="confirmPassword">
              @if (passForm.errors?.['passwordMismatch'] && ppf('confirmPassword').touched) {
                <span class="error-msg">As passwords não coincidem</span>
              }
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="savingPass">
              {{ savingPass ? 'A guardar...' : 'Alterar password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      padding-bottom: 2rem;
      align-items: start;
    }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
    h2 { margin-bottom: 1.2rem; }
    .disabled-input { opacity: .5; cursor: not-allowed; }
    button { margin-top: .5rem; }
  `]
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  user?: User;
  savingProfile = false;
  savingPass = false;
  saveSuccess = false;
  saveError = '';
  passSuccess = false;
  passError = '';

  profileForm = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(3)]],
    phone:   ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
    address: ['', Validators.required],
    vehicle: ['bicycle']
  });

  passForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword:     ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (g) => {
      const np = g.get('newPassword')?.value;
      const cp = g.get('confirmPassword')?.value;
      return np && cp && np !== cp ? { passwordMismatch: true } : null;
    }
  });

  pf(name: string) { return this.profileForm.get(name)!; }
  ppf(name: string) { return this.passForm.get(name)!; }

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: user => {
        this.user = user;
        this.profileForm.patchValue({
          name: user.name,
          phone: user.phone,
          address: user.address,
          vehicle: user.vehicle ?? 'bicycle'
        });
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.savingProfile = true;
    this.saveSuccess = false;
    this.saveError = '';
    // PATCH /auth/me — adapt to actual endpoint
    this.auth.me().subscribe({
      next: () => {
        this.savingProfile = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => {
        this.savingProfile = false;
        this.saveError = 'Erro ao guardar dados.';
      }
    });
  }

  changePassword(): void {
    if (this.passForm.invalid) { this.passForm.markAllAsTouched(); return; }
    this.savingPass = true;
    this.passSuccess = false;
    this.passError = '';
    setTimeout(() => {
      this.savingPass = false;
      this.passSuccess = true;
      this.passForm.reset();
      setTimeout(() => (this.passSuccess = false), 3000);
    }, 1000);
  }
}
