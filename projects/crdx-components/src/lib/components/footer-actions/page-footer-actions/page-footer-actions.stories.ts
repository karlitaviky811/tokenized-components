import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './page-footer-actions.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { PageFooterActionsComponent } from './page-footer-actions';
import { LibButtonComponent } from '../../button/button';

/** Contenedor de layout: proyecta los botones de acción al pie de una página. */
const meta: Meta<PageFooterActionsComponent> = {
  title: 'Layout/Page Footer Actions',
  component: PageFooterActionsComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [moduleMetadata({ imports: [LibButtonComponent] })],
};

export default meta;
type Story = StoryObj<PageFooterActionsComponent>;

export const TwoActions: Story = {
  render: () => ({
    template: `
      <div style="width: 40rem">
        <lib-page-footer-actions>
          <lib-button label="Cancelar" variant="text" />
          <lib-button label="Guardar" variant="filled" />
        </lib-page-footer-actions>
      </div>`,
  }),
};

export const SingleAction: Story = {
  render: () => ({
    template: `
      <div style="width: 40rem">
        <lib-page-footer-actions>
          <lib-button label="Continuar" variant="filled" fullWidth="true" />
        </lib-page-footer-actions>
      </div>`,
  }),
};
