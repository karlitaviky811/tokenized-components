import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './chip.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibChipComponent } from './chip';

const meta: Meta<LibChipComponent> = {
  title: 'Data Display/Chip',
  component: LibChipComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['outlined', 'elevated'] },
  },
  args: {
    label: 'Filtro',
    appearance: 'outlined',
    selected: false,
    disabled: false,
    removable: false,
  },
};

export default meta;
type Story = StoryObj<LibChipComponent>;

export const Outlined: Story = {};
export const Elevated: Story = { args: { appearance: 'elevated' } };
export const Selected: Story = { args: { selected: true } };
export const WithIcon: Story = { args: { icon: 'check' } };
export const Removable: Story = { args: { removable: true } };
export const Disabled: Story = { args: { disabled: true } };
