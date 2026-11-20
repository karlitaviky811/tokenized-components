import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './radio-button.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibRadioButtonComponent } from './radio-button';

/** El label se proyecta por contenido, de ahí el template con texto adentro. */
const meta: Meta<LibRadioButtonComponent> = {
  title: 'Form Field/Radio Button',
  component: LibRadioButtonComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    checked: false,
    disabled: false,
    value: 'opcion-1',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-radio-button [checked]="checked" [disabled]="disabled" [value]="value">
        Transferencia bancaria
      </lib-radio-button>`,
  }),
};

export default meta;
type Story = StoryObj<LibRadioButtonComponent>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
