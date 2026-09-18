import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LibBadgeComponent, LibBadgeSize } from '../badge/badge';

export type LibButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type LibButtonVariant = 'filled' | 'outlined' | 'tonal' | 'text' | 'elevated';

export type LibButtonShape = 'round' | 'square';

export type LibButtonIconPosition = 'leading' | 'trailing';

export type LibButtonContentAlign = 'start' | 'center' | 'end';

export type LibButtonBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type LibButtonBadgeMode = 'overlay' | 'inline';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [MatButton, MatIcon, NgClass, NgTemplateOutlet, LibBadgeComponent],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lib-mat-btn-host--full]': 'fullWidth()',
  },
})
export class LibButtonComponent {
  size = input<LibButtonSize>('medium');
  disabled = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  fullWidth = input(false);
  variant = input<LibButtonVariant>('filled');
  shape = input<LibButtonShape>('round');
  toggle = input(false);
  selected = input(false);
  label = input<string>('');
  icon = input<string>('');
  iconPosition = input<LibButtonIconPosition>('leading');
  contentAlign = input<LibButtonContentAlign>('center');
  labelClass = input<string>('');
  pressed = input<boolean>(false);
  debugPadding = input<boolean>(false);
  badgeCount = input<number | string>(0);
  badgeVisible = input<boolean>(false);
  badgePosition = input<LibButtonBadgePosition>('top-right');
  badgeSize = input<LibBadgeSize>('small');
  badgeMode = input<LibButtonBadgeMode>('overlay');
  readonly isPressed = signal(false);

  readonly hasInputContent = computed(
    () => this.label().length > 0 || this.icon().length > 0
  );

  readonly classes = computed(() => ({
    'lib-mat-btn': true,
    'lib-mat-btn--xsmall': this.size() === 'xsmall',
    'lib-mat-btn--small': this.size() === 'small',
    'lib-mat-btn--medium': this.size() === 'medium',
    'lib-mat-btn--large': this.size() === 'large',
    'lib-mat-btn--xlarge': this.size() === 'xlarge',
    'lib-mat-btn--full': this.fullWidth(),
    'lib-mat-btn--variant-filled': this.variant() === 'filled',
    'lib-mat-btn--variant-outlined': this.variant() === 'outlined',
    'lib-mat-btn--variant-tonal': this.variant() === 'tonal',
    'lib-mat-btn--variant-text': this.variant() === 'text',
    'lib-mat-btn--variant-elevated': this.variant() === 'elevated',
    'lib-mat-btn--shape-round': this.shape() === 'round',
    'lib-mat-btn--shape-square': this.shape() === 'square',
    'lib-mat-btn--toggle': this.toggle(),
    'lib-mat-btn--selected': this.toggle() && this.selected(),
    'lib-mat-btn--pressed': this.isPressed() || this.pressed(),
    'lib-mat-btn--debug-padding': this.debugPadding(),
    'lib-mat-btn--align-start': this.contentAlign() === 'start',
    'lib-mat-btn--align-center': this.contentAlign() === 'center',
    'lib-mat-btn--align-end': this.contentAlign() === 'end',
    'lib-mat-btn--has-badge': this.badgeVisible(),
    'lib-mat-btn--badge-overlay': this.badgeVisible() && this.badgeMode() === 'overlay',
    'lib-mat-btn--badge-inline': this.badgeVisible() && this.badgeMode() === 'inline',
    'lib-mat-btn--badge-top-right': this.badgeVisible() && this.badgeMode() === 'overlay' && this.badgePosition() === 'top-right',
    'lib-mat-btn--badge-top-left': this.badgeVisible() && this.badgeMode() === 'overlay' && this.badgePosition() === 'top-left',
    'lib-mat-btn--badge-bottom-right': this.badgeVisible() && this.badgeMode() === 'overlay' && this.badgePosition() === 'bottom-right',
    'lib-mat-btn--badge-bottom-left': this.badgeVisible() && this.badgeMode() === 'overlay' && this.badgePosition() === 'bottom-left',
  }));

  private static readonly MIN_PRESSED_MS = 180;
  private pressStartedAt = 0;
  private releaseTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.releaseTimer !== null) clearTimeout(this.releaseTimer);
    });
  }

  onPressStart(): void {
    if (this.disabled()) return;
    if (this.releaseTimer !== null) {
      clearTimeout(this.releaseTimer);
      this.releaseTimer = null;
    }
    this.pressStartedAt = Date.now();
    this.isPressed.set(true);
  }

  onPressEnd(): void {
    this.releasePressed();
  }

  onPressCancel(): void {
    this.releasePressed();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.code === 'Space' || event.code === 'Enter') this.onPressStart();
  }

  onKeyUp(): void {
    this.releasePressed();
  }

  private releasePressed(): void {
    const elapsed = Date.now() - this.pressStartedAt;
    const remaining = LibButtonComponent.MIN_PRESSED_MS - elapsed;
    if (remaining <= 0) {
      this.isPressed.set(false);
      return;
    }
    if (this.releaseTimer !== null) clearTimeout(this.releaseTimer);
    this.releaseTimer = setTimeout(() => {
      this.isPressed.set(false);
      this.releaseTimer = null;
    }, remaining);
  }
}
