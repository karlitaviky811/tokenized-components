import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './shared-table.component.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { SharedTableColumn, SharedTableComponent } from './shared-table.component';

interface Movimiento extends Record<string, unknown> {
  fecha: string;
  concepto: string;
  monto: string;
}

const COLUMNS: SharedTableColumn<Movimiento>[] = [
  { key: 'fecha', header: 'Fecha' },
  { key: 'concepto', header: 'Concepto' },
  { key: 'monto', header: 'Monto', align: 'end' },
];

const DATA: Movimiento[] = [
  { fecha: '01/10/2026', concepto: 'Depósito', monto: '₡ 250.000' },
  { fecha: '03/10/2026', concepto: 'Pago servicios', monto: '₡ -45.300' },
  { fecha: '07/10/2026', concepto: 'Transferencia', monto: '₡ -120.000' },
  { fecha: '12/10/2026', concepto: 'Salario', monto: '₡ 980.000' },
];

const meta: Meta<SharedTableComponent<Movimiento>> = {
  title: 'Data Display/Shared Table',
  component: SharedTableComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    columns: COLUMNS,
    data: DATA,
    showPaginator: true,
    pageSize: 10,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<SharedTableComponent<Movimiento>>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true, data: [] } };
export const Empty: Story = { args: { data: [], emptyState: 'No hay movimientos' } };
export const WithoutPaginator: Story = { args: { showPaginator: false } };
