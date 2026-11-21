import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  LibDatePickerComponent,
  LibModalDatePickerComponent,
  LibDockedDatePickerComponent,
} from 'crdx-components';

@Component({
  selector: 'app-date-picker-page',
  standalone: true,
  imports: [LibDatePickerComponent, LibModalDatePickerComponent, LibDockedDatePickerComponent],
  templateUrl: './date-picker.page.html',
  styleUrl: './date-picker.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerPage {
  readonly selected       = signal<Date | null>(null);
  readonly modalSelected  = signal<Date | null>(null);
  readonly dockedSelected = signal<Date | null>(null);

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

  onDockedDateChange(date: Date): void {
    this.dockedSelected.set(date);
  }

  onDockedCleared(): void {
    this.dockedSelected.set(null);
  }
}
