import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LibProgressMode, LibProgressThickness } from './progress-bar';

@Component({
  selector: 'lib-progress-spinner',
  standalone: true,
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibProgressSpinnerComponent {
  mode      = input<LibProgressMode>('determinate');
  value     = input<number>(0);
  thickness = input<LibProgressThickness>('baseline');

  readonly isDeterminate = computed(() => this.mode() === 'determinate');
  readonly isThick       = computed(() => this.thickness() === 'thick');
  readonly clampedValue  = computed(() => Math.min(100, Math.max(0, this.value())));

  /** Outer diameter in px: 40 (baseline) or 44 (thick). */
  readonly spinnerSize   = computed(() => this.isThick() ? 44 : 40);
  /** Stroke width in px: 4 (baseline) or 8 (thick). */
  readonly strokeWidth   = computed(() => this.isThick() ? 8 : 4);
  /** Center point of the viewBox. */
  readonly center        = computed(() => this.spinnerSize() / 2);
  /** Radius keeps the stroke inside the viewBox. */
  readonly radius        = computed(() => this.center() - this.strokeWidth() / 2);
  /** Full circumference of the circle. */
  readonly circumference = computed(() => +(2 * Math.PI * this.radius()).toFixed(2));
  /** Offset that shows exactly `value%` of the arc. */
  readonly dashOffset    = computed(() =>
    +(this.circumference() * (1 - this.clampedValue() / 100)).toFixed(2),
  );
  /** viewBox string, e.g. "0 0 40 40". */
  readonly viewBox       = computed(() => `0 0 ${this.spinnerSize()} ${this.spinnerSize()}`);
}
