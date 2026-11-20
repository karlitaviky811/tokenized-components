import type { Meta, StoryObj } from '@storybook/angular-vite';
import css from './date-range-picker.css?raw';
import { tokensDoc } from '../../stories-shared/consumed-tokens';
import { LibDateRangePickerComponent } from './date-range-picker';

const meta: Meta<LibDateRangePickerComponent> = {
  title: 'Date Pickers/Date Range Picker',
  component: LibDateRangePickerComponent,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: tokensDoc(css) } } },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<LibDateRangePickerComponent>;

export const Default: Story = {};
export const WithRange: Story = {
  args: { startDate: new Date(2026, 9, 1), endDate: new Date(2026, 9, 31) },
};
export const Disabled: Story = { args: { disabled: true } };
