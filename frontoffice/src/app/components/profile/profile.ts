import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: any) {
  const pw = group.get('newPassword')?.value;
  const confirm = group.get('confirm')?.value;
  return pw && confirm && pw !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly savingPw = signal(false);

  readonly form = this.fb.nonNullable.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   [{ value: '', disabled: true }],
    phone:   [''],
    address: [''],
  });

  readonly pwForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword:     ['', [Validators.required, Validators.minLength(6)]],
    confirm:         ['', [Validators.required]],
  }, { validators: passwordsMatch });

  ngOnInit(): void {
    const cached = this.auth.currentUser();
    if (cached) {
      this.form.patchValue({ name: cached.name, email: cached.email });
    }

    this.http.get<any>(`${environment.apiUrl}/auth/me`).subscribe({
      next: u => {
        this.form.patchValue({
          name:    u.name,
          email:   u.email,
          phone:   u.phone   ?? '',
          address: u.address ?? '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveProfile(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);

    const { name, phone, address } = this.form.getRawValue();
    this.http.patch(`${environment.apiUrl}/auth/me`, { name, phone, address }).subscribe({
      next: () => {
        this.snack.open('Perfil atualizado com sucesso.', 'OK', { duration: 3000 });
        this.saving.set(false);
      },
      error: err => {
        this.snack.open(err.error?.error ?? 'Erro ao guardar o perfil.', 'OK', { duration: 3000 });
        this.saving.set(false);
      },
    });
  }

  changePassword(): void {
    if (this.pwForm.invalid) { this.pwForm.markAllAsTouched(); return; }
    this.savingPw.set(true);

    const { currentPassword, newPassword } = this.pwForm.getRawValue();
    this.http.patch(`${environment.apiUrl}/auth/me/password`, { currentPassword, newPassword }).subscribe({
      next: () => {
        this.snack.open('Password alterada com sucesso.', 'OK', { duration: 3000 });
        this.pwForm.reset();
        this.savingPw.set(false);
      },
      error: err => {
        this.snack.open(err.error?.error ?? 'Erro ao alterar a password.', 'OK', { duration: 3000 });
        this.savingPw.set(false);
      },
    });
  }
}
