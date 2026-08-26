import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

/**
 * Custom calendar header with independent month and year navigation.
 *
 * Angular Material's native `MatCalendarHeader` renders a single combined
 * period button ("AUGUST 2025") with one dropdown arrow. The Credix design
 * requires two separate groups — `< Aug v >` and `< 2025 v >` — so the header
 * is replaced via the datepicker's `calendarHeaderComponent` input.
 *
 * Navigation arithmetic and min/max guards mirror the native header so
 * behaviour stays consistent with Material.
 */
@Component({
  selector: 'lib-date-picker-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './date-picker-header.html',
  styleUrl: './date-picker-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibDatePickerHeaderComponent<D> {
  private readonly calendar = inject<MatCalendar<D>>(MatCalendar);
  private readonly dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly monthLabel = signal('');
  protected readonly yearLabel = signal('');

  constructor() {
    this.updateLabels();

    this.calendar.stateChanges
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => {
        this.updateLabels();
        this.cdr.markForCheck();
      });
  }

  private updateLabels(): void {
    const active = this.calendar.activeDate;
    const monthIndex = this.dateAdapter.getMonth(active);
    this.monthLabel.set(this.dateAdapter.getMonthNames('short')[monthIndex]);
    this.yearLabel.set(this.dateAdapter.getYearName(active));
  }

  // ── Month navigation ────────────────────────────────────────────────────

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

  /** Opens the month grid so the user can pick a month directly. */
  protected toggleMonthView(): void {
    this.calendar.currentView = this.calendar.currentView === 'year' ? 'month' : 'year';
  }

  // ── Year navigation ─────────────────────────────────────────────────────

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

  /** Opens the multi-year grid so the user can pick a year directly. */
  protected toggleYearView(): void {
    this.calendar.currentView = this.calendar.currentView === 'multi-year' ? 'month' : 'multi-year';
  }

  private isSameMonth(a: D, b: D): boolean {
    return (
      this.dateAdapter.getYear(a) === this.dateAdapter.getYear(b) &&
      this.dateAdapter.getMonth(a) === this.dateAdapter.getMonth(b)
    );
  }
}
