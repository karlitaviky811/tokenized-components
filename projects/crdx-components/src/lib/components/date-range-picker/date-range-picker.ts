import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDatepickerModule,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';

export interface DateRange {
  start: Date;
  end: Date;
}

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
  selector: 'lib-date-range-picker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerActions,
    MatDatepickerApply,
    MatDatepickerCancel,
  ],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_FORMATS, useValue: CREDIX_DATE_FORMATS }],
})
export class LibDateRangePickerComponent {
  startDate = input<Date | null>(null);
  endDate   = input<Date | null>(null);
  disabled  = input(false);
  min       = input<Date | null>(null);
  max       = input<Date | null>(null);

  readonly rangeChange = output<DateRange>();

  protected readonly _range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end:   new FormControl<Date | null>(null),
  });

  // True when the user clicked Apply (not Cancel/outside-close)
  protected _applyPending = false;

  constructor() {
    effect(() => {
      this._range.setValue(
        { start: this.startDate(), end: this.endDate() },
        { emitEvent: false },
      );
    });

    effect(() => {
      if (this.disabled()) {
        this._range.disable({ emitEvent: false });
      } else {
        this._range.enable({ emitEvent: false });
      }
    });
  }

  protected _markApply(): void {
    this._applyPending = true;
  }

  protected _onClosed(): void {
    if (this._applyPending) {
      const start = this._range.controls.start.value;
      const end   = this._range.controls.end.value;
      if (start && end) {
        this.rangeChange.emit({ start, end });
      }
    } else {
      // Cancel or outside-click: reset pending selection to last committed values
      this._range.setValue(
        { start: this.startDate(), end: this.endDate() },
        { emitEvent: false },
      );
    }
    this._applyPending = false;
  }
}
