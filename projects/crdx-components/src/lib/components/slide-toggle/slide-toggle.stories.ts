import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './slide-toggle.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibSlideToggleComponent } from './slide-toggle';

/** El label se proyecta por contenido, de ahí el template con texto adentro. */
const meta: Meta<LibSlideToggleComponent> = {
  title: 'Form Field/Slide Toggle',
  component: LibSlideToggleComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    checked: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-slide-toggle [checked]="checked">
        Notificaciones push
      </lib-slide-toggle>`,
  }),
};

export default meta;
type Story = StoryObj<LibSlideToggleComponent>;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
