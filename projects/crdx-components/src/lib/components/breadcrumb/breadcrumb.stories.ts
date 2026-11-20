import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './breadcrumb.component.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { moduleMetadata } from '@storybook/angular-vite';
import { ActivatedRoute } from '@angular/router';
import { LibBreadcrumbComponent } from './breadcrumb.component';

/**
 * El componente lee labels/urls desde `ActivatedRoute.snapshot.data` (inyectado
 * como opcional). Acá proveemos un `ActivatedRoute` mock con datos de ruta para
 * que renderice un breadcrumb realista sin montar el Router.
 */
const meta: Meta<LibBreadcrumbComponent> = {
  title: 'Navigation/Breadcrumb',
  component: LibBreadcrumbComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { breadcrumb: 'Detalle de cuenta' } },
            parent: { snapshot: { data: { breadcrumb: 'Cuentas', url: '/cuentas' } } },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LibBreadcrumbComponent>;

export const Default: Story = {};
