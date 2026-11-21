import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './circular-progress-stepper.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibCircularProgressStepperComponent } from './circular-progress-stepper';

const meta: Meta<LibCircularProgressStepperComponent> = {
  title: 'Feedback/Circular Progress Stepper',
  component: LibCircularProgressStepperComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    currentStep: { control: { type: 'number', min: 0 } },
    totalSteps: { control: { type: 'number', min: 1 } },
  },
  args: {
    currentStep: 2,
    totalSteps: 5,
    size: '64px',
    barWidth: '10px',
  },
};

export default meta;
type Story = StoryObj<LibCircularProgressStepperComponent>;

export const Default: Story = {};
export const Start: Story = { args: { currentStep: 0 } };
export const Complete: Story = { args: { currentStep: 5 } };
export const Large: Story = { args: { size: '120px', barWidth: '16px' } };
