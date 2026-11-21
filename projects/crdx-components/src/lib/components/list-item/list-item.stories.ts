import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './list-item.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibListItemComponent } from './list-item';

const meta: Meta<LibListItemComponent> = {
  title: 'Data Display/List Item',
  component: LibListItemComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    checkboxPosition: { control: 'inline-radio', options: ['leading', 'trailing'] },
    trailingType: { control: 'inline-radio', options: ['checkbox', 'icon', 'none'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
  },
  args: {
    data: { id: '1', label: 'Ana Jiménez', description: 'ana@credix.com', avatarText: 'AJ' },
    selected: false,
    disabled: false,
    showAvatar: true,
    showCheckbox: true,
    checkboxPosition: 'trailing',
    trailingType: 'checkbox',
    density: 'default',
  },
  render: (args) => ({
    props: args,
    template: `<div style="width: 24rem"><lib-list-item
      [data]="data" [selected]="selected" [disabled]="disabled"
      [showAvatar]="showAvatar" [showCheckbox]="showCheckbox"
      [checkboxPosition]="checkboxPosition" [trailingType]="trailingType"
      [density]="density" /></div>`,
  }),
};

export default meta;
type Story = StoryObj<LibListItemComponent>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Compact: Story = { args: { density: 'compact' } };
export const TrailingIcon: Story = { args: { trailingType: 'icon' } };
export const Disabled: Story = { args: { disabled: true } };
