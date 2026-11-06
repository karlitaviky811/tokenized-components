import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './progress-bar.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibProgressBarComponent } from './progress-bar';

const meta: Meta<LibProgressBarComponent> = {
  title: 'Feedback/Progress Bar',
  component: LibProgressBarComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    mode: { control: 'inline-radio', options: ['determinate', 'indeterminate'] },
    thickness: { control: 'inline-radio', options: ['baseline', 'thick'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    mode: 'determinate',
    value: 60,
    thickness: 'baseline',
  },
  render: (args) => ({
    props: args,
    template: `<div style="width: 20rem"><lib-progress-bar [mode]="mode" [value]="value" [thickness]="thickness" /></div>`,
  }),
};

export default meta;
type Story = StoryObj<LibProgressBarComponent>;

export const Determinate: Story = {};
export const Indeterminate: Story = { args: { mode: 'indeterminate' } };
export const Thick: Story = { args: { thickness: 'thick' } };
