import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { LibButtonComponent, LibButtonVariant } from '../button/button';

export type LibStackedCardVariant = 'outlined' | 'elevated' | 'filled';

@Component({
  selector: 'lib-stacked-card',
  standalone: true,
  imports: [NgClass, LibButtonComponent],
  templateUrl: './stacked-card.html',
  styleUrl: './stacked-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibStackedCardComponent {
  variant = input<LibStackedCardVariant>('outlined');
  headerText = input('Header');
  subhead = input('Subhead');
  avatarText = input('');
  mediaUrl = input('');
  mediaAlt = input('Card media');
  cardTitle = input('Title');
  subtitle = input('Subtitle');
  supportingText = input(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
  );
  primaryLabel = input('Primary');
  secondaryLabel = input('Secondary');
  primaryVariant = input<LibButtonVariant>('filled');
  secondaryVariant = input<LibButtonVariant>('filled');
  showSecondary = input(true);
  showActions = input(true);

  readonly primaryAction = output<void>();
  readonly secondaryAction = output<void>();
  readonly headerActionClick = output<void>();

  readonly initial = computed(() => {
    const a = this.avatarText().trim();
    if (a.length) return a.slice(0, 1).toUpperCase();
    const h = this.headerText().trim();
    return h.length ? h.slice(0, 1).toUpperCase() : 'A';
  });

  readonly hasMedia = computed(() => this.mediaUrl().trim().length > 0);

  readonly classes = computed(() => ({
    'lib-stacked-card': true,
    'lib-stacked-card--outlined': this.variant() === 'outlined',
    'lib-stacked-card--elevated': this.variant() === 'elevated',
    'lib-stacked-card--filled': this.variant() === 'filled',
  }));
}
