import type { Preview } from '@storybook/angular-vite';
import { applicationConfig } from '@storybook/angular-vite';
import { APP_INITIALIZER, inject, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Mismo locale que la app demo (projects/demo/src/main.ts).
registerLocaleData(localeEs);

const preview: Preview = {
  // Providers a nivel aplicación — replican el bootstrap de la demo para que
  // los componentes Material (animaciones, iconos, datepicker) rendericen igual.
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideNativeDateAdapter(),
        { provide: LOCALE_ID, useValue: 'es' },
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
    }),
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
