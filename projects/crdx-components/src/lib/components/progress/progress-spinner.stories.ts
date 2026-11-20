import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './progress-spinner.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibProgressSpinnerComponent } from './progress-spinner';

const meta: Meta<LibProgressSpinnerComponent> = {
  title: 'Feedback/Progress Spinner',
  component: LibProgressSpinnerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    mode: { control: 'inline-radio', options: ['determinate', 'indeterminate'] },
    thickness: { control: 'inline-radio', options: ['baseline', 'thick'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    mode: 'determinate',
    value: 75,
    thickness: 'baseline',
  },
};

export default meta;
type Story = StoryObj<LibProgressSpinnerComponent>;

export const Determinate: Story = {};
export const Indeterminate: Story = { args: { mode: 'indeterminate' } };
export const Thick: Story = { args: { thickness: 'thick' } };
