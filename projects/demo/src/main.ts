import { APP_INITIALIZER, inject, LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(APP_ROUTES),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID,       useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const registry = inject(MatIconRegistry);
        return () => registry.setDefaultFontSetClass('material-symbols-outlined');
      },
      multi: true,
    },
  ],
});
