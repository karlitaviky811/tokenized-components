import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibProgressBarComponent, LibProgressSpinnerComponent } from 'crdx-components';

@Component({
  selector: 'app-progress-indicator-page',
  standalone: true,
  imports: [LibProgressBarComponent, LibProgressSpinnerComponent],
  templateUrl: './progress-indicator.page.html',
  styleUrl: './progress-indicator.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressIndicatorPage {
  readonly progress = signal(50);
}
