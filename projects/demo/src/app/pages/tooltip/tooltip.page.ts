import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibTooltipComponent } from 'crdx-components';

@Component({
  selector: 'app-tooltip-page',
  standalone: true,
  imports: [LibTooltipComponent],
  templateUrl: './tooltip.page.html',
  styleUrl: './tooltip.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPage {
  /**
   * `lib-tooltip` no gestiona visibilidad ni trigger: solo pinta la burbuja.
   * La vista que lo consume decide cuál está visible.
   */
  private readonly activeHint = signal<string | null>(null);

  isHintVisible(id: string): boolean {
    return this.activeHint() === id;
  }

  showHint(id: string): void {
    this.activeHint.set(id);
  }

  hideHint(): void {
    this.activeHint.set(null);
  }
}
