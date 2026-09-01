import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type LibButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type LibButtonVariant = 'filled' | 'outlined' | 'tonal' | 'text' | 'elevated';

export type LibButtonShape = 'round' | 'square';

export type LibButtonIconPosition = 'leading' | 'trailing';

export type LibButtonContentAlign = 'start' | 'center' | 'end';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgClass],
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
  readonly isPressed = signal(false);

  /** Usa template interno si hay label/icon via input. */
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
  }));

  onPressStart(): void {
    if (!this.disabled()) this.isPressed.set(true);
  }

  onPressEnd(): void {
    this.isPressed.set(false);
  }

  onPressCancel(): void {
    this.isPressed.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.code === 'Space' || event.code === 'Enter') this.isPressed.set(true);
  }

  onKeyUp(): void {
    this.isPressed.set(false);
  }
}
