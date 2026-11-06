import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './modal-footer-actions.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { ModalFooterActionsComponent } from './modal-footer-actions';
import { LibButtonComponent } from '../../button/button';

/** Contenedor de layout: proyecta los botones de acción al pie de un modal. */
const meta: Meta<ModalFooterActionsComponent> = {
  title: 'Layout/Modal Footer Actions',
  component: ModalFooterActionsComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [moduleMetadata({ imports: [LibButtonComponent] })],
};

export default meta;
type Story = StoryObj<ModalFooterActionsComponent>;

export const TwoActions: Story = {
  render: () => ({
    template: `
      <div style="width: 24rem">
        <lib-modal-footer-actions>
          <lib-button label="Cancelar" variant="text" />
          <lib-button label="Confirmar" variant="filled" />
        </lib-modal-footer-actions>
      </div>`,
  }),
};
