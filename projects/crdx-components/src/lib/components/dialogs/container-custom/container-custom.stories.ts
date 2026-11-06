import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './container-custom.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { Component, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ContainerCustom } from './container-custom';

/**
 * Contenedor genérico: proyecta un componente en runtime (`NgComponentOutlet`)
 * con su propio inyector y comparte un signal `dialogState`.
 */
@Component({
  standalone: true,
  template: `
    <div style="padding: 1.5rem; background: #fff; border-radius: 0.5rem">
      <h3 style="margin: 0 0 0.5rem">Modal personalizado</h3>
      <p style="margin: 0; color: #5b5f61">Contenido arbitrario proyectado por el consumidor.</p>
    </div>`,
})
class ContainerDemoContent {}

const dialogState = signal<'open' | 'closed'>('open');

const meta: Meta<ContainerCustom> = {
  title: 'Overlays/Container Custom',
  component: ContainerCustom,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [
        { provide: DialogRef, useValue: { close: () => {} } },
        {
          provide: DIALOG_DATA,
          useValue: { content: ContainerDemoContent, dialogState, modalData: {} },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ContainerCustom>;

export const Default: Story = {};
