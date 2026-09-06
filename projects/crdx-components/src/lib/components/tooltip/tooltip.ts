import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type LibTooltipType = 'single-line' | 'multi-line';

@Component({
  selector: 'lib-tooltip',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lib-tooltip-host]': 'true',
  },
})
export class LibTooltipComponent {
  /** Texto del tooltip. */
  text = input('Supporting text');

  /** Variante del tooltip según Figma: single-line o multi-line. */
  type = input<LibTooltipType>('single-line');

  /** Ancho máximo opcional para controlar el wrap en multi-line (ej: "12.5rem", "200px"). */
  maxWidth = input<string | null>(null);

  readonly classes = computed(() => ({
    'lib-tooltip--single-line': this.type() === 'single-line',
    'lib-tooltip--multi-line': this.type() === 'multi-line',
  }));
}
