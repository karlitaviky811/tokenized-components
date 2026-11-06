import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './spinner.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibSpinnerComponent } from './spinner';

const meta: Meta<LibSpinnerComponent> = {
  title: 'Feedback/Spinner',
  component: LibSpinnerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    diameter: 48,
    strokeWidth: 4,
    ariaLabel: 'Cargando',
  },
};

export default meta;
type Story = StoryObj<LibSpinnerComponent>;

export const Default: Story = {};
export const Small: Story = { args: { diameter: 24, strokeWidth: 3 } };
export const Large: Story = { args: { diameter: 72, strokeWidth: 6 } };
