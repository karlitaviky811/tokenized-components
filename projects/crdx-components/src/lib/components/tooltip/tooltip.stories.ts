import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './tooltip.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibTooltipComponent } from './tooltip';

const meta: Meta<LibTooltipComponent> = {
  title: 'Feedback/Tooltip',
  component: LibTooltipComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    type: { control: 'inline-radio', options: ['single-line', 'multi-line'] },
  },
  args: {
    text: 'Texto de ayuda',
    type: 'single-line',
  },
};

export default meta;
type Story = StoryObj<LibTooltipComponent>;

export const SingleLine: Story = {};
export const MultiLine: Story = {
  args: {
    type: 'multi-line',
    text: 'Este es un tooltip de varias líneas que explica con más detalle la acción disponible.',
    maxWidth: '16rem',
  },
};
