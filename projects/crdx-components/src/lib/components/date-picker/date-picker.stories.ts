import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './date-picker.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibDatePickerComponent } from './date-picker';

const meta: Meta<LibDatePickerComponent> = {
  title: 'Date Pickers/Date Picker',
  component: LibDatePickerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    label: 'Fecha de nacimiento',
    hint: 'DD/MM/YYYY',
    placeholder: 'DD/MM/YYYY',
    showClear: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibDatePickerComponent>;

export const Default: Story = {};
export const WithValue: Story = { args: { value: new Date(2026, 9, 15) } };
export const Disabled: Story = { args: { disabled: true } };
export const WithoutClear: Story = { args: { showClear: false } };
