import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './snackbar.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { LibSnackbarComponent, LibSnackbarData } from './snackbar';

/**
 * Normalmente se abre vía `LibSnackbarStore.openText(...)`. Acá renderizamos el
 * panel interno directo, inyectando `MatSnackBarRef` y `MAT_SNACK_BAR_DATA`
 * mockeados.
 */
const meta: Meta<LibSnackbarComponent> = {
  title: 'Feedback/Snackbar',
  component: LibSnackbarComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [
        { provide: MatSnackBarRef, useValue: { dismiss: () => {}, dismissWithAction: () => {} } },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LibSnackbarComponent>;

const withData = (data: LibSnackbarData): Story => ({
  decorators: [moduleMetadata({ providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: data }] })],
});

export const TextOnly = withData({ message: 'Cambios guardados' });

export const WithAction = withData({
  message: 'Registro eliminado',
  actionLabel: 'Deshacer',
});

export const WithClose = withData({
  message: 'Se copió el número de cuenta',
  showClose: true,
});

export const LongerAction = withData({
  message: 'No se pudo sincronizar la información con el servidor remoto',
  actionLabel: 'Reintentar',
  longerAction: true,
});
