import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './header.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibHeaderComponent } from './header';

/**
 * Los íconos se cargan desde un sprite SVG (`iconBasePath`). En Storybook no se
 * sirve ese sprite, así que los glifos pueden no verse — el layout sí es fiel.
 */
const meta: Meta<LibHeaderComponent> = {
  title: 'Navigation/Header',
  component: LibHeaderComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    brandLabel: 'Credix',
    showLeading: true,
    leadingActionLabel: 'Abrir navegación',
    trailingActions: [
      { icon: 'bell', ariaLabel: 'Notificaciones', id: 'notifications' },
      { icon: 'user', ariaLabel: 'Perfil', id: 'profile' },
    ],
  },
};

export default meta;
type Story = StoryObj<LibHeaderComponent>;

export const Default: Story = {};
export const WithoutLeading: Story = { args: { showLeading: false } };
export const CustomBrand: Story = { args: { brandLabel: 'Mi App' } };
