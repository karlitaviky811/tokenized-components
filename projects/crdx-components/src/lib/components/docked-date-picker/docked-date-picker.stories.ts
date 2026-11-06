import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './docked-date-picker.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibDockedDatePickerComponent } from './docked-date-picker';

const meta: Meta<LibDockedDatePickerComponent> = {
  title: 'Date Pickers/Docked Date Picker',
  component: LibDockedDatePickerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    label: 'Fecha',
    hint: 'DD/MM/YYYY',
    placeholder: 'DD/MM/YYYY',
    showClear: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibDockedDatePickerComponent>;

export const Default: Story = {};
export const WithValue: Story = { args: { value: new Date(2026, 9, 15) } };
export const Disabled: Story = { args: { disabled: true } };
