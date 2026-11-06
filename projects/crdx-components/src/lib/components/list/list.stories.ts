import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './list.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibListComponent } from './list';
import { LibListItemData } from '../list-item/list-item';

const ITEMS: LibListItemData[] = [
  { id: '1', label: 'Ana Jiménez', description: 'ana@credix.com', avatarText: 'AJ' },
  { id: '2', label: 'Bruno Castro', description: 'bruno@credix.com', avatarText: 'BC' },
  { id: '3', label: 'Carla Mora', description: 'carla@credix.com', avatarText: 'CM' },
];

const meta: Meta<LibListComponent> = {
  title: 'Data Display/List',
  component: LibListComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    checkboxPosition: { control: 'inline-radio', options: ['leading', 'trailing'] },
    trailingType: { control: 'inline-radio', options: ['checkbox', 'icon', 'none'] },
    density: { control: 'inline-radio', options: ['default', 'compact'] },
  },
  args: {
    items: ITEMS,
    multiple: true,
    showCheckbox: true,
    showAvatar: true,
    showDividers: true,
    checkboxPosition: 'trailing',
    trailingType: 'checkbox',
    density: 'default',
    width: '24rem',
  },
};

export default meta;
type Story = StoryObj<LibListComponent>;

export const Default: Story = {};
export const PreselectedItem: Story = { args: { selectedIds: ['2'] } };
export const SingleSelection: Story = { args: { multiple: false } };
export const Compact: Story = { args: { density: 'compact' } };
export const WithoutAvatars: Story = { args: { showAvatar: false } };
