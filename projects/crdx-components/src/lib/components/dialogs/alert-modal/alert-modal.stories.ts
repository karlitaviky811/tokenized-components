import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './alert-modal.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { AlertModal } from './alert-modal';

/**
 * Normalmente se abre vía su store. Acá renderizamos el componente interno
 * directo, inyectando `DialogRef` y `DIALOG_DATA` mockeados.
 */
const meta: Meta<AlertModal> = {
  title: 'Overlays/Alert Modal',
  component: AlertModal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [{ provide: DialogRef, useValue: { close: () => {} } }],
    }),
  ],
};

export default meta;
type Story = StoryObj<AlertModal>;

const withData = (data: Record<string, unknown>): Story => ({
  decorators: [moduleMetadata({ providers: [{ provide: DIALOG_DATA, useValue: data }] })],
});

export const Default = withData({
  title: 'Información importante',
  content: 'Tu sesión expirará en 5 minutos por inactividad.',
  labelButtonConfirm: 'Entendido',
});

export const WithCancel = withData({
  title: '¿Continuar sin guardar?',
  content: 'Hay cambios sin guardar que se perderán.',
  labelButtonCancel: 'Volver',
  labelButtonConfirm: 'Continuar',
});

export const WithExtraBlock = withData({
  title: 'Datos de la transferencia',
  subtitle: 'Referencia',
  subtitleAlign: 'center',
  extraBlock: ['CR05', '0152', '0020', '0145'],
  labelButtonConfirm: 'Cerrar',
});
