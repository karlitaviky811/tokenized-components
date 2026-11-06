import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './icon-button.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { MatIconModule } from '@angular/material/icon';
import { LibIconButtonComponent } from './icon-button';

/**
 * El ícono se proyecta por contenido (`<ng-content>`), así que las stories usan
 * un template con un `<mat-icon>` adentro.
 */
const meta: Meta<LibIconButtonComponent> = {
  title: 'Actions/Icon Button',
  component: LibIconButtonComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [moduleMetadata({ imports: [MatIconModule] })],
  argTypes: {
    variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'standard', 'action'] },
    size: { control: 'select', options: ['xsmall', 'small', 'medium', 'large', 'xlarge'] },
    shape: { control: 'inline-radio', options: ['round', 'square'] },
    space: { control: 'inline-radio', options: ['narrow', 'default', 'wide'] },
  },
  args: {
    variant: 'standard',
    size: 'small',
    shape: 'round',
    space: 'default',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-icon-button
        [variant]="variant" [size]="size" [shape]="shape" [space]="space"
        [disabled]="disabled" [toggle]="toggle" [selected]="selected">
        <mat-icon>favorite</mat-icon>
      </lib-icon-button>`,
  }),
};

export default meta;
type Story = StoryObj<LibIconButtonComponent>;

export const Standard: Story = {};
export const Filled: Story = { args: { variant: 'filled' } };
export const Tonal: Story = { args: { variant: 'tonal' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Square: Story = { args: { shape: 'square' } };
export const Disabled: Story = { args: { disabled: true } };
