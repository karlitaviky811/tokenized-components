import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LibDatePickerHeaderComponent } from './date-picker-header';

const CREDIX_DATE_FORMATS = {
  parse:   { dateInput: { month: 'short', day: 'numeric', year: 'numeric' } },
  display: {
    dateInput:          { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearLabel:     { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions,
    dateA11yLabel:      { day: 'numeric', month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearA11yLabel: { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions,
  },
};

@Component({
  selector: 'lib-date-picker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerActions,
    MatDatepickerApply,
    MatDatepickerCancel,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_FORMATS, useValue: CREDIX_DATE_FORMATS }],
})
export class LibDatePickerComponent {
  value    = input<Date | null>(null);
  disabled = input(false);
  min      = input<Date | null>(null);
  max      = input<Date | null>(null);
  label    = input<string>('Date');
  hint     = input<string>('DD/MM/YYYY');
  placeholder = input<string>('DD/MM/YYYY');
  showClear = input<boolean>(true);

  readonly dateChange = output<Date>();
  readonly cleared = output<void>();

  /** Custom header with separate month/year navigation groups. */
  protected readonly headerComponent = LibDatePickerHeaderComponent;

  protected readonly _selected = linkedSignal<Date | null>(() => this.value());

  protected readonly _displayValue = computed(() => this.value() ?? this._selected());
  protected readonly _label = computed(() => this.label());

  protected _onChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this._selected.set(event.value);
      this.dateChange.emit(event.value);
    }
  }

  protected _onClear(): void {
    this._selected.set(null);
    this.cleared.emit();
  }
}
