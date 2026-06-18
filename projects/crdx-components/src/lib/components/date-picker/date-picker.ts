import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
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

const CREDIX_DATE_FORMATS = {
  parse:   { dateInput: { month: 'short', day: 'numeric', year: 'numeric' } },
  display: {
    dateInput:          { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearLabel:     { month: 'short', year: 'numeric' } as Intl.DateTimeFormatOptions,
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

  readonly dateChange = output<Date>();

  protected readonly _selected = signal<Date | null>(null);

  constructor() {
    effect(() => { this._selected.set(this.value()); });
  }

  protected readonly _displayValue = computed(() => this.value() ?? this._selected());

  protected _onChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this._selected.set(event.value);
      this.dateChange.emit(event.value);
    }
  }
}
