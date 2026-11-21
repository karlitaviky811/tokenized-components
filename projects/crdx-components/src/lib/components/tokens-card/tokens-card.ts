import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface LibTokensCardSlide {
  readonly title: string;
  readonly subtitle: string;
}

const DEFAULT_SLIDES: readonly LibTokensCardSlide[] = [
  { title: 'Tokens', subtitle: 'Foundation for consistency' },
  { title: 'Colors', subtitle: 'Brand palette & surfaces' },
  { title: 'Typography', subtitle: 'Type scale & weights' },
  { title: 'Spacing', subtitle: 'Layout rhythm & density' },
];

@Component({
  selector: 'lib-tokens-card',
  standalone: true,
  templateUrl: './tokens-card.html',
  styleUrl: './tokens-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibTokensCardComponent {
  readonly slides = input<readonly LibTokensCardSlide[]>(DEFAULT_SLIDES);
  readonly activeIndex = signal(0);

  readonly activeSlide = computed(() => {
    const items = this.slides();
    const index = this.activeIndex();
    return items[index] ?? items[0];
  });

  selectSlide(index: number): void {
    const total = this.slides().length;
    if (index < 0 || index >= total) return;
    this.activeIndex.set(index);
  }
}
