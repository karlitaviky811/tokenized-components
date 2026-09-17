import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type LibBadgeSize = 'large' | 'small';

@Component({
  selector: 'lib-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibBadgeComponent {
  /** Número o texto a mostrar. Solo visible en size="large". */
  label = input('');
  size = input<LibBadgeSize>('large');

  readonly isLarge = computed(() => this.size() === 'large');

  readonly classes = computed(() => ({
    'lib-badge': true,
    'lib-badge--large': this.isLarge(),
    'lib-badge--small': !this.isLarge(),
  }));
}
