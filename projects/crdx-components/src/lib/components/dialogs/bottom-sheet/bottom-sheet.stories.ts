import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './bottom-sheet.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { Component, signal } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { BottomSheet } from './bottom-sheet';

/**
 * Contenedor estructural: proyecta un componente en runtime (`NgComponentOutlet`)
 * y comparte un signal `dialogState`. Acá le pasamos un componente de demo y la
 * DI mockeada. El posicionamiento real es un overlay anclado al fondo.
 */
@Component({
  standalone: true,
  template: `
    <div style="padding: 1rem">
      <h3 style="margin: 0 0 0.5rem">Opciones de la cuenta</h3>
      <p style="margin: 0; color: #5b5f61">Contenido proyectado dentro del bottom sheet.</p>
    </div>`,
})
class BottomSheetDemoContent {}

const dialogState = signal<'open' | 'closed'>('open');

const meta: Meta<BottomSheet> = {
  title: 'Overlays/Bottom Sheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [
        { provide: DialogRef, useValue: { close: () => {} } },
        {
          provide: DIALOG_DATA,
          useValue: { content: BottomSheetDemoContent, showDragHandle: true, dialogState },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<BottomSheet>;

export const Default: Story = {};
