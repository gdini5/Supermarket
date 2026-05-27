import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { AuthService } from './services/auth.service';

// Regista a locale portuguesa para que CurrencyPipe formate como "3,50 €"
// em vez do default americano. Tem de ser feito antes do bootstrap.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),

    // Locale por defeito da app (afeta CurrencyPipe, DatePipe, DecimalPipe).
    { provide: LOCALE_ID, useValue: 'pt' },

    // Antes de a app arrancar: valida o token guardado contra /auth/me.
    // Se expirou ou o utilizador foi desativado, a UI já abre no estado correto.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return firstValueFrom(auth.loadCurrentUser()).catch(() => null);
    }),
  ],
};
