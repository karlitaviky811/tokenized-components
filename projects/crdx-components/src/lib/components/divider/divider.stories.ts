import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './divider.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibDividerComponent } from './divider';

const meta: Meta<LibDividerComponent> = {
  title: 'Data Display/Divider',
  component: LibDividerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<LibDividerComponent>;

export const Horizontal: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="width: 20rem"><lib-divider [orientation]="orientation" /></div>`,
  }),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => ({
    props: args,
    template: `<div style="height: 6rem"><lib-divider [orientation]="orientation" /></div>`,
  }),
};
