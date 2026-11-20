import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibSlideToggleComponent } from 'crdx-components';

@Component({
  selector: 'app-slide-toggle-page',
  standalone: true,
  imports: [LibSlideToggleComponent],
  templateUrl: './slide-toggle.page.html',
  styleUrl: './slide-toggle.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideTogglePage {
  active = signal(false);
}
