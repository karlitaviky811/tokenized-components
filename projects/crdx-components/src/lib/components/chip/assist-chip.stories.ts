import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './assist-chip.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibAssistChipComponent } from './assist-chip';

const meta: Meta<LibAssistChipComponent> = {
  title: 'Data Display/Assist Chip',
  component: LibAssistChipComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['outlined', 'elevated'] },
  },
  args: {
    label: 'Agregar al calendario',
    appearance: 'outlined',
    icon: 'event',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibAssistChipComponent>;

export const Outlined: Story = {};
export const Elevated: Story = { args: { appearance: 'elevated' } };
export const Disabled: Story = { args: { disabled: true } };
