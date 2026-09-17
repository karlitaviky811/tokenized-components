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
import { LibDockedDatePickerHeaderComponent } from './docked-date-picker-header';

/**
 * Formatos de fecha del design system (compartidos con las demás variantes).
 * Input DD/MM/YYYY; labels de mes/año en formato largo.
 */
const CREDIX_DATE_FORMATS = {
  parse: { dateInput: { month: 'short', day: 'numeric', year: 'numeric' } },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearLabel: { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions,
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions,
    monthYearA11yLabel: { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions,
  },
};

/**
 * Docked date picker con vistas de mes/año como listas verticales scrolleables
 * (Figma node 273:6136). La vista de día usa la grilla nativa de Material; las
 * vistas de mes y año se reemplazan por listas en el header custom.
 *
 * Variante independiente: no reemplaza a `lib-date-picker` ni `lib-modal-date-picker`.
 */
@Component({
  selector: 'lib-docked-date-picker',
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
  templateUrl: './docked-date-picker.html',
  styleUrl: './docked-date-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MAT_DATE_FORMATS, useValue: CREDIX_DATE_FORMATS }],
})
export class LibDockedDatePickerComponent {
  readonly value = input<Date | null>(null);
  readonly disabled = input(false);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly label = input<string>('Date');
  readonly hint = input<string>('DD/MM/YYYY');
  readonly placeholder = input<string>('DD/MM/YYYY');
  readonly showClear = input<boolean>(true);

  readonly dateChange = output<Date>();
  readonly cleared = output<void>();

  /** Header con navegación dual + vistas de lista para mes/año. */
  protected readonly headerComponent = LibDockedDatePickerHeaderComponent;

  protected readonly _selected = linkedSignal<Date | null>(() => this.value());

  protected readonly _displayValue = computed(() => this.value() ?? this._selected());

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
