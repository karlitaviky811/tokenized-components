import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './modal-date-picker.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibModalDatePickerComponent } from './modal-date-picker';

const meta: Meta<LibModalDatePickerComponent> = {
  title: 'Date Pickers/Modal Date Picker',
  component: LibModalDatePickerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    label: 'Seleccionar fecha',
    showClear: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibModalDatePickerComponent>;

export const Default: Story = {};
export const WithValue: Story = { args: { value: new Date(2026, 9, 15) } };
export const Disabled: Story = { args: { disabled: true } };
