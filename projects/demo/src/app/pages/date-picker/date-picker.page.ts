import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibDatePickerComponent, LibModalDatePickerComponent } from 'crdx-components';

@Component({
  selector: 'app-date-picker-page',
  standalone: true,
  imports: [LibDatePickerComponent, LibModalDatePickerComponent],
  templateUrl: './date-picker.page.html',
  styleUrl: './date-picker.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerPage {
  readonly selected      = signal<Date | null>(null);
  readonly modalSelected = signal<Date | null>(null);

  onDateChange(date: Date): void {
    this.selected.set(date);
  }

  onCleared(): void {
    this.selected.set(null);
  }

  onModalDateChange(date: Date): void {
    this.modalSelected.set(date);
  }

  onModalCleared(): void {
    this.modalSelected.set(null);
  }
}
