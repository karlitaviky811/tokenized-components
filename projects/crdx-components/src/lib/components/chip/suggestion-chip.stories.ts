import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './suggestion-chip.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibSuggestionChipComponent } from './suggestion-chip';

const meta: Meta<LibSuggestionChipComponent> = {
  title: 'Data Display/Suggestion Chip',
  component: LibSuggestionChipComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['outlined', 'elevated'] },
  },
  args: {
    label: '¿Transferencia?',
    appearance: 'outlined',
    selected: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibSuggestionChipComponent>;

export const Outlined: Story = {};
export const Elevated: Story = { args: { appearance: 'elevated' } };
export const Selected: Story = { args: { selected: true } };
export const WithIcon: Story = { args: { icon: 'lightbulb' } };
export const Disabled: Story = { args: { disabled: true } };
