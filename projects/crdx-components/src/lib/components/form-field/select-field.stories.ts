import type { Meta, StoryObj } from '@storybook/angular-vite';
import { componentWrapperDecorator } from '@storybook/angular-vite';
import css from './select-field.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibSelectFieldComponent, LibSelectOption } from './select-field';

const OPTIONS: LibSelectOption<string>[] = [
  { value: 'cr', label: 'Costa Rica' },
  { value: 'pa', label: 'Panamá' },
  { value: 'ni', label: 'Nicaragua' },
  { value: 'gt', label: 'Guatemala' },
];

const meta: Meta<LibSelectFieldComponent<string>> = {
  title: 'Form Field/Select Field',
  component: LibSelectFieldComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['outline', 'filled'] },
    mode: { control: 'inline-radio', options: ['single', 'multiple'] },
  },
  args: {
    label: 'País',
    placeholder: 'Elegir opción',
    options: OPTIONS,
    mode: 'single',
    appearance: 'outline',
    filterable: true,
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj<LibSelectFieldComponent<string>>;

export const Single: Story = {};
export const Multiple: Story = { args: { mode: 'multiple', label: 'Países' } };
export const Required: Story = { args: { required: true } };
export const WithError: Story = { args: { error: 'Debés seleccionar un país', invalid: true } };
export const Disabled: Story = { args: { disabled: true } };

export const FullWidth: Story = {
  args: { fullWidth: true },
  // Contenedor ancho para que el 100% de `fullWidth` sea visible.
  decorators: [componentWrapperDecorator((story) => `<div style="width: 40rem; max-width: 100%;">${story}</div>`)],
};
