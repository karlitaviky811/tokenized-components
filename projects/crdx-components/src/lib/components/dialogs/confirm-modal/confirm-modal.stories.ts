import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './confirm-modal.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ConfirmModal, ConfirmModalData } from './confirm-modal';

/**
 * Normalmente se abre vía `ConfirmModalStore.open(...)`. Para documentarlo, acá
 * renderizamos el componente interno directo, inyectando `DialogRef` y
 * `DIALOG_DATA` mockeados — así se ve la UI del modal dentro del canvas.
 */
const meta: Meta<ConfirmModal> = {
  title: 'Overlays/Confirm Modal',
  component: ConfirmModal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [{ provide: DialogRef, useValue: { close: () => {} } }],
    }),
  ],
};

export default meta;
type Story = StoryObj<ConfirmModal>;

const withData = (data: ConfirmModalData): Story => ({
  decorators: [moduleMetadata({ providers: [{ provide: DIALOG_DATA, useValue: data }] })],
});

export const Basic = withData({
  title: '¿Eliminar este registro?',
  labelButtonConfirm: 'Eliminar',
  labelButtonCancel: 'Cancelar',
});

export const WithDescription = withData({
  title: '¿Cerrar sesión?',
  description: 'Vas a salir de tu cuenta. Podés volver a iniciar sesión cuando quieras.',
  labelButtonConfirm: 'Cerrar sesión',
  labelButtonCancel: 'Cancelar',
});

export const WithIcon = withData({
  title: 'Cambios guardados',
  description: 'Tus datos se actualizaron correctamente.',
  labelButtonConfirm: 'Aceptar',
  labelButtonCancel: 'Cancelar',
  showTopIcon: true,
  topIconName: 'check_circle',
});
