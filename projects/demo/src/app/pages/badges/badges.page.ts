import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibBadgeComponent, LibStateBadgeComponent } from 'crdx-components';

@Component({
  selector: 'app-badges-page',
  standalone: true,
  imports: [LibBadgeComponent, LibStateBadgeComponent],
  templateUrl: './badges.page.html',
  styleUrl: './badges.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgesPage {
  readonly count = signal(3);
  readonly overflowCount = signal(99);
}
