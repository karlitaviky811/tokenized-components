import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

export type LibIconButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type LibIconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard' | 'action';
export type LibIconButtonShape = 'round' | 'square';
/** Espacio horizontal (padding) según Figma: narrow, default, wide. */
export type LibIconButtonSpace = 'narrow' | 'default' | 'wide';

@Component({
  selector: 'lib-icon-button',
  standalone: true,
  imports: [NgClass, MatRippleModule],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibIconButtonComponent {
  size = input<LibIconButtonSize>('small');
  variant = input<LibIconButtonVariant>('standard');
  shape = input<LibIconButtonShape>('round');
  /** Variante de espacio (padding inline) desde Figma: narrow, default, wide. */
  space = input<LibIconButtonSpace>('default');
  disabled = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  toggle = input(false);
  selected = input(false);

  readonly classes = computed(() => ({
    'ui-icon-btn--xsmall': this.size() === 'xsmall',
    'ui-icon-btn--small': this.size() === 'small',
    'ui-icon-btn--medium': this.size() === 'medium',
    'ui-icon-btn--large': this.size() === 'large',
    'ui-icon-btn--xlarge': this.size() === 'xlarge',
    'ui-icon-btn--shape-round': this.shape() === 'round',
    'ui-icon-btn--shape-square': this.shape() === 'square',
    'ui-icon-btn--space-narrow': this.space() === 'narrow',
    'ui-icon-btn--space-default': this.space() === 'default',
    'ui-icon-btn--space-wide': this.space() === 'wide',
    'ui-icon-btn--variant-filled': this.variant() === 'filled',
    'ui-icon-btn--variant-tonal': this.variant() === 'tonal',
    'ui-icon-btn--variant-outlined': this.variant() === 'outlined',
    'ui-icon-btn--variant-standard': this.variant() === 'standard',
    'ui-icon-btn--variant-action': this.variant() === 'action',
    'ui-icon-btn--toggle': this.toggle(),
    'ui-icon-btn--toggle-selected': this.toggle() && this.selected(),
  }));
}
