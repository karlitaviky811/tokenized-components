import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './badge.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibBadgeComponent } from './badge';

const meta: Meta<LibBadgeComponent> = {
  title: 'Data Display/Badge',
  component: LibBadgeComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'] },
  },
  args: {
    label: '8',
    size: 'large',
  },
};

export default meta;
type Story = StoryObj<LibBadgeComponent>;

export const Large: Story = {};
export const Small: Story = { args: { size: 'small' } };
export const HighCount: Story = { args: { label: '99+' } };
