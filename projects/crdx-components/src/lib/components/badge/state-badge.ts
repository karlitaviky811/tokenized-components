import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type LibStateBadgeVariant = 'error' | 'success' | 'information' | 'warning' | 'neutral';

const VARIANT_ICON: Record<LibStateBadgeVariant, string> = {
  error:       'cancel',
  success:     'check_circle',
  information: 'info',
  warning:     'warning',
  neutral:     'radio_button_checked',
};

@Component({
  selector: 'lib-state-badge',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './state-badge.html',
  styleUrl: './state-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibStateBadgeComponent {
  label    = input('');
  variant  = input<LibStateBadgeVariant>('error');
  showIcon = input(true);

  readonly icon = computed(() => VARIANT_ICON[this.variant()]);

  readonly classes = computed(() => ({
    'lib-state-badge': true,
    [`lib-state-badge--${this.variant()}`]: true,
  }));
}
