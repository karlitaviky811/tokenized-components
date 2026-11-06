import type { Meta, StoryObj } from '@storybook/angular-vite';
import { componentWrapperDecorator } from '@storybook/angular-vite';
import { LibButtonComponent } from './button';
import css from './button.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';

const meta: Meta<LibButtonComponent> = {
  title: 'Actions/Button',
  component: LibButtonComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'outlined', 'tonal', 'text', 'elevated'] },
    size: { control: 'select', options: ['xsmall', 'small', 'medium', 'large', 'xlarge'] },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
    iconPosition: { control: 'inline-radio', options: ['leading', 'trailing'] },
  },
  args: {
    label: 'Continuar',
    variant: 'filled',
    size: 'medium',
    shape: 'round',
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<LibButtonComponent>;

export const Filled: Story = {};
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Text: Story = { args: { variant: 'text' } };
export const Elevated: Story = { args: { variant: 'elevated' } };

export const WithLeadingIcon: Story = {
  args: { label: 'Agregar', icon: 'add', iconPosition: 'leading' },
};

export const WithBadge: Story = {
  args: { label: 'Notificaciones', badgeVisible: true, badgeCount: 3 },
};

export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = {
  args: { fullWidth: true },
  // Contenedor ancho para que el 100% de `fullWidth` sea visible.
  decorators: [componentWrapperDecorator((story) => `<div style="width: 40rem; max-width: 100%;">${story}</div>`)],
};
