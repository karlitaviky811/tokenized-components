import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './checkbox.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibCheckboxComponent } from './checkbox';

/** El label se proyecta por contenido, de ahí el template con texto adentro. */
const meta: Meta<LibCheckboxComponent> = {
  title: 'Form Field/Checkbox',
  component: LibCheckboxComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    error: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-checkbox
        [checked]="checked" [indeterminate]="indeterminate"
        [disabled]="disabled" [error]="error">
        Acepto los términos y condiciones
      </lib-checkbox>`,
  }),
};

export default meta;
type Story = StoryObj<LibCheckboxComponent>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Error: Story = { args: { error: true } };
export const Disabled: Story = { args: { disabled: true } };
