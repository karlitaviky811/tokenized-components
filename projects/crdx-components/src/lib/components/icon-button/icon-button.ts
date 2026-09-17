import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

export type LibIconButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type LibIconButtonShape = 'round' | 'square';
export type LibIconButtonSpace = 'narrow' | 'default' | 'wide';
export type LibIconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard' | 'action';

@Component({
  selector: 'lib-icon-button',
  standalone: true,
  imports: [NgClass, MatIconButton],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibIconButtonComponent {
  size = input<LibIconButtonSize>('small');
  variant = input<LibIconButtonVariant>('standard');
  shape = input<LibIconButtonShape>('round');
  space = input<LibIconButtonSpace>('default');
  disabled = input(false);
  toggle = input(false);
  selected = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  readonly isPressed = signal(false);

  readonly classes = computed(() => ({
    'lib-icon-btn--xsmall': this.size() === 'xsmall',
    'lib-icon-btn--small': this.size() === 'small',
    'lib-icon-btn--medium': this.size() === 'medium',
    'lib-icon-btn--large': this.size() === 'large',
    'lib-icon-btn--xlarge': this.size() === 'xlarge',
    'lib-icon-btn--shape-round': this.shape() === 'round',
    'lib-icon-btn--shape-square': this.shape() === 'square',
    'lib-icon-btn--space-narrow': this.space() === 'narrow',
    'lib-icon-btn--space-default': this.space() === 'default',
    'lib-icon-btn--space-wide': this.space() === 'wide',
    'lib-icon-btn--variant-filled': this.variant() === 'filled',
    'lib-icon-btn--variant-tonal': this.variant() === 'tonal',
    'lib-icon-btn--variant-outlined': this.variant() === 'outlined',
    'lib-icon-btn--variant-standard': this.variant() === 'standard',
    'lib-icon-btn--variant-action': this.variant() === 'action',
    'lib-icon-btn--toggle': this.toggle(),
    'lib-icon-btn--toggle-selected': this.toggle() && this.selected(),
    'lib-icon-btn--pressed': this.isPressed(),
  }));

  /** Duración mínima (ms) que el morph pressed permanece visible, aunque el
   *  click sea instantáneo. Evita el "flash" imperceptible en clicks rápidos. */
  private static readonly MIN_PRESSED_MS = 180;
  private pressStartedAt = 0;
  private releaseTimer: ReturnType<typeof setTimeout> | null = null;

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

  /** Libera el estado pressed respetando la duración mínima visible. */
  private releasePressed(): void {
    const elapsed = Date.now() - this.pressStartedAt;
    const remaining = LibIconButtonComponent.MIN_PRESSED_MS - elapsed;
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
