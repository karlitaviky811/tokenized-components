import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './error-modal.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ErrorModal } from './error-modal';

/**
 * Normalmente se abre vía su store. Acá renderizamos el componente interno
 * directo, inyectando `DialogRef` y `DIALOG_DATA` mockeados.
 */
const meta: Meta<ErrorModal> = {
  title: 'Overlays/Error Modal',
  component: ErrorModal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [{ provide: DialogRef, useValue: { close: () => {} } }],
    }),
  ],
};

export default meta;
type Story = StoryObj<ErrorModal>;

const withData = (data: Record<string, unknown>): Story => ({
  decorators: [moduleMetadata({ providers: [{ provide: DIALOG_DATA, useValue: data }] })],
});

export const Default = withData({
  message: 'No pudimos procesar tu solicitud. Intentá nuevamente en unos minutos.',
});

export const WithDetail = withData({
  message: 'No pudimos procesar tu solicitud.',
  detail: 'ERR_TIMEOUT · request-id 8f2a-91c3',
});
