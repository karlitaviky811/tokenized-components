import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type LibCardVariant = 'outlined' | 'elevated' | 'filled';
export type LibCardState = 'enabled' | 'hovered' | 'focused' | 'pressed' | 'dragged';
export type LibCardLeadingKind = 'avatar' | 'icon';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lib-card-host--full-width]': 'fullWidth()',
  },
})
export class LibCardComponent {
  title = input('Header');
  subhead = input('');
  variant = input<LibCardVariant>('outlined');
  state = input<LibCardState>('enabled');
  leadingKind = input<LibCardLeadingKind>('avatar');
  leadingIcon = input<string>('');
  /** Tamaño del contenedor leading (Figma suele usar 2.5rem). */
  leadingContainerSize = input('2.5rem');
  /** Tamaño del icono leading. */
  leadingIconSize = input('2.08331rem');
  mediaIcon = input<string>('');
  mediaAlt = input('Card media');
  showMedia = input(false);
  avatarText = input('');
  width = input('20.5rem');
  /** Alto del card. */
  height = input('4.5rem');
  /** Si es true, el card toma el 100% del ancho del contenedor padre. */
  fullWidth = input(false);
  active = input(false);
  disabled = input(false);

  readonly cardClick = output<void>();

  readonly initial = computed(() => {
    const text = this.avatarText().trim();
    if (text.length) return text.slice(0, 1).toUpperCase();
    const title = this.title().trim();
    return title.length ? title.slice(0, 1).toUpperCase() : 'A';
  });

  readonly hasMedia = computed(() => this.mediaIcon().trim().length > 0);
  readonly isMediaImage = computed(() => this.mediaIcon().trim().endsWith('.svg'));
  readonly hasLeadingIcon = computed(() => this.leadingIcon().trim().length > 0);
  readonly isLeadingImage = computed(() => this.leadingIcon().trim().endsWith('.svg'));
  readonly hasSubhead = computed(() => this.subhead().trim().length > 0);

  readonly classes = computed(() => ({
    'lib-card': true,
    'lib-card--outlined': this.variant() === 'outlined',
    'lib-card--elevated': this.variant() === 'elevated',
    'lib-card--filled': this.variant() === 'filled',
    'lib-card--state-enabled': this.state() === 'enabled',
    'lib-card--state-hovered': this.state() === 'hovered',
    'lib-card--state-focused': this.state() === 'focused',
    'lib-card--state-pressed': this.state() === 'pressed',
    'lib-card--state-dragged': this.state() === 'dragged',
    'lib-card--leading-avatar': this.leadingKind() === 'avatar',
    'lib-card--leading-icon': this.leadingKind() === 'icon',
    'lib-card--with-media': this.showMedia() && this.hasMedia(),
    'lib-card--title-emphasized': !this.hasSubhead(),
    'lib-card--active': this.active(),
    'lib-card--disabled': this.disabled(),
  }));

  onCardClick(): void {
    if (this.disabled()) return;
    this.cardClick.emit();
  }

  onCardKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      this.cardClick.emit();
    }
  }
}
