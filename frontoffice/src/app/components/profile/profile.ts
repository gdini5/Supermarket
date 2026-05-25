import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

/**
 * Perfil do cliente — ver e editar dados pessoais (nome, telefone, morada).
 * O email e o role não são editáveis aqui.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly user = signal<User | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: user => {
        this.user.set(user);
        this.form.patchValue({
          name: user.name,
          phone: user.phone,
          address: user.address,
        });
        this.loading.set(false);
      },
      error: () => {
        this.snack.open('Não foi possível carregar o teu perfil.', 'Fechar', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.auth.updateProfile(this.form.getRawValue()).subscribe({
      next: user => {
        this.user.set(user);
        this.saving.set(false);
        this.snack.open('Perfil atualizado com sucesso.', 'OK', { duration: 3000 });
      },
      error: err => {
        this.saving.set(false);
        const msg = err?.error?.error ?? 'Não foi possível atualizar o perfil.';
        this.snack.open(msg, 'Fechar', { duration: 4000 });
      },
    });
  }

  /** Primeira letra do nome, para o avatar. */
  initial(): string {
    return this.user()?.name?.charAt(0).toUpperCase() ?? '?';
  }
}
