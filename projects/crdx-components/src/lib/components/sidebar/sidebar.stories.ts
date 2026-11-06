import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './sidebar.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibSidebarComponent, SidebarNavItem } from './sidebar';

/**
 * Los íconos se cargan desde un sprite SVG (`spritePath`). En Storybook no se
 * sirve ese sprite, así que los glifos pueden no verse — el layout sí es fiel.
 */
const ITEMS: SidebarNavItem[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'cards', label: 'Tarjetas', icon: 'credit-card' },
  { id: 'transfers', label: 'Transferencias', icon: 'swap' },
  { id: 'settings', label: 'Ajustes', icon: 'settings' },
];

const meta: Meta<LibSidebarComponent> = {
  title: 'Navigation/Sidebar',
  component: LibSidebarComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    type: { control: 'inline-radio', options: ['docked', 'floating'] },
    alignment: { control: 'inline-radio', options: ['top', 'middle'] },
  },
  args: {
    items: ITEMS,
    selectedId: 'home',
    showLabels: true,
    type: 'docked',
    alignment: 'top',
  },
};

export default meta;
type Story = StoryObj<LibSidebarComponent>;

export const Default: Story = {};
export const Floating: Story = { args: { type: 'floating' } };
export const IconsOnly: Story = { args: { showLabels: false } };
export const MiddleAligned: Story = { args: { alignment: 'middle' } };
