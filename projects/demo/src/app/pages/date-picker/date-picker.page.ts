import { Component, signal } from '@angular/core';
import { LibDatePickerComponent, LibDateRangePickerComponent, DateRange } from 'crdx-components';

@Component({
  selector: 'app-date-picker-page',
  standalone: true,
  imports: [LibDatePickerComponent, LibDateRangePickerComponent],
  template: `
    <article class="doc-page">
      <section class="doc-section">
        <h2>Date Picker <code>lib-date-picker</code></h2>
        <p>Selector de fecha con variante docked (inline). Usa los tokens de diseño del sistema Credix.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>value</td><td>Date | null</td><td>null</td><td>Fecha seleccionada (controlled)</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>false</td><td>Deshabilita el componente</td></tr>
          <tr><td>min</td><td>Date | null</td><td>null</td><td>Fecha mínima seleccionable</td></tr>
          <tr><td>max</td><td>Date | null</td><td>null</td><td>Fecha máxima seleccionable</td></tr>
          <tr><th>Output</th><th>Tipo</th><th></th><th>Descripción</th></tr>
          <tr><td>dateChange</td><td>Date</td><td></td><td>Emite la fecha seleccionada</td></tr>
        </table>

        <h3>Default</h3>
        <div class="component-doc">
          <div class="component-doc__header">
            <span class="component-doc__title"><span>❖</span> Date Picker</span>
            <span class="component-doc__code-icon">&lt;/&gt;</span>
          </div>
          <div class="component-doc__preview">
            <lib-date-picker (dateChange)="onDateChange($event)" />
          </div>
          <div class="component-doc__footer">Building Blocks</div>
        </div>

        @if (selected()) {
          <p>Fecha seleccionada: <code>{{ selected()!.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</code></p>
        }

        <h3>Con rango (min / max)</h3>
        <div class="component-doc">
          <div class="component-doc__header">
            <span class="component-doc__title"><span>❖</span> Date Picker — con rango</span>
            <span class="component-doc__code-icon">&lt;/&gt;</span>
          </div>
          <div class="component-doc__preview">
            <lib-date-picker
              [min]="minDate"
              [max]="maxDate"
              (dateChange)="onDateChange($event)"
            />
          </div>
          <div class="component-doc__footer">Building Blocks</div>
        </div>

        <h3>Disabled</h3>
        <div class="component-doc">
          <div class="component-doc__header">
            <span class="component-doc__title"><span>❖</span> Date Picker — disabled</span>
            <span class="component-doc__code-icon">&lt;/&gt;</span>
          </div>
          <div class="component-doc__preview">
            <lib-date-picker [disabled]="true" />
          </div>
          <div class="component-doc__footer">Building Blocks</div>
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-date-picker
  [min]="minDate"
  [max]="maxDate"
  [value]="selectedDate"
  (dateChange)="onDateChange($event)"
/&gt;</code></pre>
      </section>

      <section class="doc-section">
        <h2>Date Range Picker <code>lib-date-range-picker</code></h2>
        <p>Selector de rango de fechas. Usa los mismos tokens Credix que el date picker simple.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>startDate</td><td>Date | null</td><td>null</td><td>Fecha inicio (controlled)</td></tr>
          <tr><td>endDate</td><td>Date | null</td><td>null</td><td>Fecha fin (controlled)</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>false</td><td>Deshabilita el componente</td></tr>
          <tr><td>min</td><td>Date | null</td><td>null</td><td>Fecha mínima seleccionable</td></tr>
          <tr><td>max</td><td>Date | null</td><td>null</td><td>Fecha máxima seleccionable</td></tr>
          <tr><th>Output</th><th>Tipo</th><th></th><th>Descripción</th></tr>
          <tr><td>rangeChange</td><td>DateRange</td><td></td><td>Emite &#123; start, end &#125; al aplicar</td></tr>
        </table>

        <h3>Default</h3>
        <div class="component-doc">
          <div class="component-doc__header">
            <span class="component-doc__title"><span>❖</span> Date Range Picker</span>
            <span class="component-doc__code-icon">&lt;/&gt;</span>
          </div>
          <div class="component-doc__preview">
            <lib-date-range-picker (rangeChange)="onRangeChange($event)" />
          </div>
          <div class="component-doc__footer">Building Blocks</div>
        </div>

        @if (selectedRange()) {
          <p>Rango: <code>{{ selectedRange()!.start.toLocaleDateString('es') }} – {{ selectedRange()!.end.toLocaleDateString('es') }}</code></p>
        }

        <h3>Disabled</h3>
        <div class="component-doc">
          <div class="component-doc__header">
            <span class="component-doc__title"><span>❖</span> Date Range Picker — disabled</span>
            <span class="component-doc__code-icon">&lt;/&gt;</span>
          </div>
          <div class="component-doc__preview">
            <lib-date-range-picker [disabled]="true" />
          </div>
          <div class="component-doc__footer">Building Blocks</div>
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-date-range-picker
  [startDate]="range.start"
  [endDate]="range.end"
  (rangeChange)="onRangeChange($event)"
/&gt;</code></pre>
      </section>
    </article>
  `,
})
export class DatePickerPage {
  readonly selected      = signal<Date | null>(null);
  readonly selectedRange = signal<DateRange | null>(null);

  readonly minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  readonly maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0);

  onDateChange(date: Date): void {
    this.selected.set(date);
  }

  onRangeChange(range: DateRange): void {
    this.selectedRange.set(range);
  }
}
