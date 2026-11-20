import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LibProgressMode = 'determinate' | 'indeterminate';
export type LibProgressThickness = 'baseline' | 'thick';

@Component({
  selector: 'lib-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibProgressBarComponent {
  mode      = input<LibProgressMode>('determinate');
  value     = input<number>(0);
  thickness = input<LibProgressThickness>('baseline');

  readonly isDeterminate = computed(() => this.mode() === 'determinate');
  readonly isThick       = computed(() => this.thickness() === 'thick');
  readonly clampedValue  = computed(() => Math.min(100, Math.max(0, this.value())));
  readonly showStop      = computed(() => this.isDeterminate() && this.clampedValue() < 100);
  readonly widthPercent  = computed(() => `${this.clampedValue()}%`);
}
