import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

/** Vista activa del header. La grilla de días la pinta MatCalendar; las de
 *  mes/año son listas verticales custom superpuestas. */
type DockedView = 'day' | 'month' | 'year';

interface MonthRow {
  index: number;
  label: string;
  focused: boolean;
  disabled: boolean;
}

interface YearRow {
  year: number;
  label: string;
  focused: boolean;
  disabled: boolean;
}

/** Cuántos años mostrar hacia atrás/adelante cuando no hay min/max. */
const DEFAULT_YEARS_BACK = 100;
const DEFAULT_YEARS_FORWARD = 10;

/**
 * Header del docked date picker con navegación dual (mes y año por separado)
 * y vistas de selección de mes/año como listas verticales scrolleables,
 * fieles al Figma 273:6136.
 *
 * Inyecta `MatCalendar` y usa `activeDate` como única fuente de verdad del
 * período en foco, replicando el patrón de `lib-date-picker-header`.
 */
@Component({
  selector: 'lib-docked-date-picker-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './docked-date-picker-header.html',
  styleUrl: './docked-date-picker-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibDockedDatePickerHeaderComponent<D> {
  private readonly calendar = inject<MatCalendar<D>>(MatCalendar);
  private readonly dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly view = signal<DockedView>('day');
  protected readonly monthLabel = signal('');
  protected readonly yearLabel = signal('');
  protected readonly months = signal<MonthRow[]>([]);
  protected readonly years = signal<YearRow[]>([]);

  private readonly listRef = viewChild<ElementRef<HTMLUListElement>>('list');

  constructor() {
    this.updateLabels();
    this.calendar.stateChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateLabels());
  }

  // ── Labels ────────────────────────────────────────────────────────────

  private updateLabels(): void {
    const active = this.calendar.activeDate;
    const monthIndex = this.dateAdapter.getMonth(active);
    this.monthLabel.set(this.dateAdapter.getMonthNames('short')[monthIndex]);
    this.yearLabel.set(this.dateAdapter.getYearName(active));
    this.months.set(this._buildMonths());
    this.years.set(this._buildYears());
  }

  private _buildMonths(): MonthRow[] {
    const active = this.calendar.activeDate;
    const activeMonth = this.dateAdapter.getMonth(active);
    return this.dateAdapter.getMonthNames('long').map((label, index) => ({
      index,
      label,
      focused: index === activeMonth,
      disabled: this.isMonthDisabled(index),
    }));
  }

  private _buildYears(): YearRow[] {
    const activeYear = this.dateAdapter.getYear(this.calendar.activeDate);
    const min = this.calendar.minDate;
    const max = this.calendar.maxDate;
    const start = min ? this.dateAdapter.getYear(min) : activeYear - DEFAULT_YEARS_BACK;
    const end = max ? this.dateAdapter.getYear(max) : activeYear + DEFAULT_YEARS_FORWARD;
    const rows: YearRow[] = [];
    for (let year = start; year <= end; year++) {
      rows.push({ year, label: String(year), focused: year === activeYear, disabled: false });
    }
    return rows;
  }

  // ── View switching ──────────────────────────────────────────────────────

  protected openMonthView(): void {
    this.view.set('month');
    this.toggleCalendarGrid(false);
    this.scrollFocusedIntoView();
  }

  protected openYearView(): void {
    this.view.set('year');
    this.toggleCalendarGrid(false);
    this.scrollFocusedIntoView();
  }

  protected backToDay(): void {
    this.view.set('day');
    this.toggleCalendarGrid(true);
  }

  /**
   * La grilla de días de Material (`.mat-calendar-content`) es un hermano de
   * este header dentro de `.mat-calendar`. Cuando mostramos una lista custom,
   * ocultamos esa grilla marcando el ancestro con una clase, en vez de usar
   * selectores CSS frágiles.
   */
  private toggleCalendarGrid(visible: boolean): void {
    const calendarEl = this.hostEl.nativeElement.closest('.mat-calendar');
    calendarEl?.classList.toggle('ddp-hide-grid', !visible);
  }

  // ── Month navigation (arrows) ────────────────────────────────────────────

  protected previousMonth(): void {
    if (!this.previousMonthEnabled()) return;
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
  }

  protected nextMonth(): void {
    if (!this.nextMonthEnabled()) return;
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
  }

  protected previousMonthEnabled(): boolean {
    const min = this.calendar.minDate;
    return !min || !this.isSameMonth(this.calendar.activeDate, min);
  }

  protected nextMonthEnabled(): boolean {
    const max = this.calendar.maxDate;
    return !max || !this.isSameMonth(this.calendar.activeDate, max);
  }

  // ── Year navigation (arrows) ─────────────────────────────────────────────

  protected previousYear(): void {
    if (!this.previousYearEnabled()) return;
    this.calendar.activeDate = this.dateAdapter.addCalendarYears(this.calendar.activeDate, -1);
  }

  protected nextYear(): void {
    if (!this.nextYearEnabled()) return;
    this.calendar.activeDate = this.dateAdapter.addCalendarYears(this.calendar.activeDate, 1);
  }

  protected previousYearEnabled(): boolean {
    const min = this.calendar.minDate;
    return !min || this.dateAdapter.getYear(this.calendar.activeDate) > this.dateAdapter.getYear(min);
  }

  protected nextYearEnabled(): boolean {
    const max = this.calendar.maxDate;
    return !max || this.dateAdapter.getYear(this.calendar.activeDate) < this.dateAdapter.getYear(max);
  }

  // ── Month list ────────────────────────────────────────────────────────────

  protected selectMonth(index: number): void {
    if (this.isMonthDisabled(index)) return;
    this.calendar.activeDate = this.dateAdapter.createDate(
      this.dateAdapter.getYear(this.calendar.activeDate),
      index,
      Math.min(
        this.dateAdapter.getDate(this.calendar.activeDate),
        this.daysInMonth(this.dateAdapter.getYear(this.calendar.activeDate), index),
      ),
    );
    this.view.set('day');
    this.toggleCalendarGrid(true);
  }

  private isMonthDisabled(index: number): boolean {
    const year = this.dateAdapter.getYear(this.calendar.activeDate);
    const min = this.calendar.minDate;
    const max = this.calendar.maxDate;
    if (min && (year < this.dateAdapter.getYear(min) ||
      (year === this.dateAdapter.getYear(min) && index < this.dateAdapter.getMonth(min)))) {
      return true;
    }
    if (max && (year > this.dateAdapter.getYear(max) ||
      (year === this.dateAdapter.getYear(max) && index > this.dateAdapter.getMonth(max)))) {
      return true;
    }
    return false;
  }

  // ── Year list ─────────────────────────────────────────────────────────────

  protected selectYear(year: number): void {
    const currentMonth = this.dateAdapter.getMonth(this.calendar.activeDate);
    const currentDay = this.dateAdapter.getDate(this.calendar.activeDate);
    this.calendar.activeDate = this.dateAdapter.createDate(
      year,
      currentMonth,
      Math.min(currentDay, this.daysInMonth(year, currentMonth)),
    );
    this.view.set('month');
    this.scrollFocusedIntoView();
  }

  // ── Keyboard a11y for lists ───────────────────────────────────────────────

  protected onListKeydown(event: KeyboardEvent, kind: 'month' | 'year'): void {
    const items = kind === 'month' ? this.months() : this.years();
    const focusedPos = items.findIndex((i) => i.focused);
    let nextPos = focusedPos;

    switch (event.key) {
      case 'ArrowDown':
        nextPos = Math.min(items.length - 1, focusedPos + 1);
        break;
      case 'ArrowUp':
        nextPos = Math.max(0, focusedPos - 1);
        break;
      case 'Home':
        nextPos = 0;
        break;
      case 'End':
        nextPos = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (kind === 'month') this.selectMonth((items[focusedPos] as MonthRow).index);
        else this.selectYear((items[focusedPos] as YearRow).year);
        event.preventDefault();
        return;
      case 'Escape':
        this.backToDay();
        event.preventDefault();
        return;
      default:
        return;
    }

    event.preventDefault();
    if (nextPos === focusedPos) return;
    if (kind === 'month') {
      this.calendar.activeDate = this.dateAdapter.createDate(
        this.dateAdapter.getYear(this.calendar.activeDate),
        (items[nextPos] as MonthRow).index,
        1,
      );
    } else {
      this.calendar.activeDate = this.dateAdapter.createDate(
        (items[nextPos] as YearRow).year,
        this.dateAdapter.getMonth(this.calendar.activeDate),
        1,
      );
    }
    this.scrollFocusedIntoView();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  /** Centra y enfoca el item en foco una vez que la lista está en el DOM. */
  private scrollFocusedIntoView(): void {
    // Doble rAF: el primero espera al cambio de `view`, el segundo al pintado
    // de la lista, de modo que el nodo [data-focused] ya exista.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const focused = this.listRef()?.nativeElement.querySelector<HTMLElement>('[data-focused="true"]');
        focused?.scrollIntoView({ block: 'center' });
        focused?.focus();
      }),
    );
  }

  private isSameMonth(a: D, b: D): boolean {
    return (
      this.dateAdapter.getYear(a) === this.dateAdapter.getYear(b) &&
      this.dateAdapter.getMonth(a) === this.dateAdapter.getMonth(b)
    );
  }

  private daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
}
