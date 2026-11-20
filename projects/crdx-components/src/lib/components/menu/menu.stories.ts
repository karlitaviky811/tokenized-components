import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './menu.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibMenuComponent, LibMenuOption } from './menu';

const OPTIONS: LibMenuOption<string>[] = [
  { value: 'edit', label: 'Editar' },
  { value: 'duplicate', label: 'Duplicar' },
  { value: 'archive', label: 'Archivar' },
  { value: 'delete', label: 'Eliminar' },
];

/**
 * @deprecated El equipo recomienda `lib-select-field` para implementaciones nuevas.
 * Se documenta para la ventana de migración.
 */
const meta: Meta<LibMenuComponent<string>> = {
  title: 'Form Field/Menu (deprecated)',
  component: LibMenuComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'multiple'] },
  },
  args: {
    label: 'Acciones',
    placeholder: 'Seleccionar',
    options: OPTIONS,
    mode: 'single',
    filterable: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibMenuComponent<string>>;

export const Single: Story = {};
export const Multiple: Story = { args: { mode: 'multiple' } };
export const Disabled: Story = { args: { disabled: true } };
