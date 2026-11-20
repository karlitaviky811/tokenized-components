import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './side-modal.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { Component, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SideModal } from './side-modal';

/**
 * Contenedor estructural: proyecta un componente en runtime (`NgComponentOutlet`)
 * y comparte un signal `dialogState`. El posicionamiento real es un panel lateral.
 */
@Component({
  standalone: true,
  template: `
    <div style="padding: 1rem">
      <p style="margin: 0; color: #5b5f61">Contenido proyectado dentro del side modal.</p>
    </div>`,
})
class SideModalDemoContent {}

const dialogState = signal<'open' | 'closed'>('open');

const meta: Meta<SideModal> = {
  title: 'Overlays/Side Modal',
  component: SideModal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [
        { provide: DialogRef, useValue: { close: () => {} } },
        {
          provide: DIALOG_DATA,
          useValue: {
            content: SideModalDemoContent,
            title: 'Detalle de la transacción',
            dialogState,
            footer: undefined,
            headerConfig: undefined,
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<SideModal>;

export const Default: Story = {};
