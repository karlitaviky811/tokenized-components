import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './card.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibCardComponent } from './card';

const meta: Meta<LibCardComponent> = {
  title: 'Data Display/Card',
  component: LibCardComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'elevated', 'filled'] },
    leadingKind: { control: 'inline-radio', options: ['avatar', 'icon'] },
  },
  args: {
    title: 'Cuenta de ahorros',
    subhead: '₡ 1.250.000,00',
    variant: 'outlined',
    leadingKind: 'avatar',
    avatarText: 'CA',
  },
};

export default meta;
type Story = StoryObj<LibCardComponent>;

export const Outlined: Story = {};
export const Elevated: Story = { args: { variant: 'elevated' } };
export const Filled: Story = { args: { variant: 'filled' } };

export const WithBody: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lib-card [title]="title" [subhead]="subhead" [variant]="variant"
                [leadingKind]="leadingKind" [avatarText]="avatarText">
        <p>Contenido proyectado dentro del cuerpo de la tarjeta.</p>
      </lib-card>`,
  }),
};
