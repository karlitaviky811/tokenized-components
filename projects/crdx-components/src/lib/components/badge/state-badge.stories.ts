import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './state-badge.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibStateBadgeComponent } from './state-badge';

const meta: Meta<LibStateBadgeComponent> = {
  title: 'Data Display/State Badge',
  component: LibStateBadgeComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    variant: {
      control: 'select',
      options: ['error', 'success', 'information', 'warning', 'neutral'],
    },
  },
  args: {
    label: 'Activo',
    variant: 'success',
    showIcon: true,
  },
};

export default meta;
type Story = StoryObj<LibStateBadgeComponent>;

export const Success: Story = {};
export const Error: Story = { args: { label: 'Rechazado', variant: 'error' } };
export const Information: Story = { args: { label: 'En revisión', variant: 'information' } };
export const Warning: Story = { args: { label: 'Pendiente', variant: 'warning' } };
export const Neutral: Story = { args: { label: 'Inactivo', variant: 'neutral' } };
export const WithoutIcon: Story = { args: { showIcon: false } };
