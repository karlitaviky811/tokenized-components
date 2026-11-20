import type { Meta, StoryObj } from '@storybook/angular-vite';
import { componentWrapperDecorator } from '@storybook/angular-vite';
import css from './text-field.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibTextFieldComponent } from './text-field';

/**
 * `lib-text-field` envuelve `mat-form-field` + `matInput` con soporte de signals,
 * máscaras (ngx-mask), formatos (id, currency, numeric, email) y estados de error.
 *
 * Los `input()` signals del componente se exponen como args tipados gracias a
 * `TransformComponentType` de @storybook/angular-vite — no hay que mapearlos a mano.
 */
const meta: Meta<LibTextFieldComponent> = {
  title: 'Form Field/Text Field',
  component: LibTextFieldComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['outline', 'fill', 'outlined', 'filled'],
    },
    format: {
      control: 'select',
      options: ['id', 'currency', 'numeric', 'alphanumeric', 'email'],
    },
    currencySymbol: { control: 'inline-radio', options: ['₡', '$'] },
    type: { control: 'text' },
  },
  args: {
    label: 'Nombre completo',
    appearance: 'outline',
    disabled: false,
    required: false,
    placeholder: '',
    hint: '',
    format: 'alphanumeric',
  },
};

export default meta;
type Story = StoryObj<LibTextFieldComponent>;

export const Default: Story = {};

export const WithPlaceholderAndHint: Story = {
  args: {
    label: 'Correo electrónico',
    placeholder: 'nombre@credix.com',
    hint: 'Usá tu correo corporativo',
    format: 'email',
  },
};

export const Required: Story = {
  args: {
    label: 'Cédula',
    required: true,
    format: 'id',
    mask: '#-####-####',
  },
};

/**
 * El ícono de warning NO se pinta de entrada: `invalid` solo revela el error
 * cuando el campo pierde el foco (la lógica interna activa `_showErrors` en el
 * blur). Hacé click dentro del campo y luego fuera para verlo.
 */
export const InvalidOnBlur: Story = {
  args: {
    label: 'Monto',
    required: true,
    invalid: true,
    errors: [{ kind: 'custom', message: 'El monto supera el límite disponible' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'El ícono de warning y el estado de error se revelan **al perder el foco** (blur), no antes. Hacé click dentro del campo y luego fuera para verlo.',
      },
    },
  },
};

export const Currency: Story = {
  args: {
    label: 'Monto a transferir',
    format: 'currency',
    currencySymbol: '₡',
  },
};

export const WithPrefixIcon: Story = {
  args: {
    label: 'Buscar',
    prefixIcon: 'search',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo deshabilitado',
    disabled: true,
    value: 'No editable',
  },
};

export const Loading: Story = {
  args: {
    label: 'Validando…',
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Dirección',
    fullWidth: true,
  },
  // Contenedor ancho para que el 100% de `fullWidth` sea visible (si no, el
  // campo se encoge al contenido en el canvas centrado).
  decorators: [componentWrapperDecorator((story) => `<div style="width: 40rem; max-width: 100%;">${story}</div>`)],
};
