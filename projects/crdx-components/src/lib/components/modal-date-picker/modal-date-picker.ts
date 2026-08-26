import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-modal-date-picker',
  standalone: true,
  imports: [
    MatCalendar,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './modal-date-picker.html',
  styleUrl: './modal-date-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibModalDatePickerComponent {
  value = input<Date | null>(null);
  disabled = input(false);
  min = input<Date | null>(null);
  max = input<Date | null>(null);
  label = input<string>('Select date');
  showClear = input<boolean>(true);

  readonly dateChange = output<Date>();
  readonly cancelled = output<void>();
  readonly cleared = output<void>();

  protected readonly _selected = signal<Date | null>(null);
  private _pendingSelection = signal<Date | null>(null);

  constructor() {
    effect(() => { this._selected.set(this.value()); });
  }

  protected readonly _headline = computed(() => {
    const date = this._selected();
    if (!date) return '\u00A0';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  protected _onSelect(date: Date | null): void {
    this._pendingSelection.set(date);
    this._selected.set(date);
  }

  protected _onApply(): void {
    const date = this._pendingSelection() ?? this._selected();
    if (date) {
      this.dateChange.emit(date);
    }
  }

  protected _onCancel(): void {
    this._selected.set(this.value());
    this._pendingSelection.set(null);
    this.cancelled.emit();
  }

  protected _onClear(): void {
    this._selected.set(null);
    this._pendingSelection.set(null);
    this.cleared.emit();
  }
}
