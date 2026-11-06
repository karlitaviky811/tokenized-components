import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './dynamic-dialog.css?raw';
import { tokensDoc } from '../../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DynamicDialog } from './dynamic-dialog';

/**
 * Shell de diálogo que proyecta `headerTemplate` / `bodyTemplate` /
 * `actionsTemplate` provistos por el consumidor en runtime. Sin templates
 * muestra el marco vacío — su contenido depende de quién lo abre vía store.
 */
const meta: Meta<DynamicDialog> = {
  title: 'Overlays/Dynamic Dialog',
  component: DynamicDialog,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [
        { provide: DialogRef, useValue: { close: () => {} } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DynamicDialog>;

export const EmptyShell: Story = {};
