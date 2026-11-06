import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './stacked-card.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibStackedCardComponent } from './stacked-card';

const meta: Meta<LibStackedCardComponent> = {
  title: 'Data Display/Stacked Card',
  component: LibStackedCardComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'elevated', 'filled'] },
  },
  args: {
    variant: 'outlined',
    headerText: 'Tarjeta de crédito',
    subhead: 'Visa •••• 4821',
    avatarText: 'VC',
    cardTitle: 'Resumen del mes',
    subtitle: 'Octubre 2026',
    primaryLabel: 'Pagar',
    secondaryLabel: 'Ver detalle',
    showActions: true,
    showSecondary: true,
  },
};

export default meta;
type Story = StoryObj<LibStackedCardComponent>;

export const Outlined: Story = {};
export const Elevated: Story = { args: { variant: 'elevated' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const SinglePrimaryAction: Story = { args: { showSecondary: false } };
export const WithoutActions: Story = { args: { showActions: false } };
