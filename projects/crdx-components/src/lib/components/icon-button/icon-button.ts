import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { NgClass } from '@angular/common';

import { MatRippleModule } from '@angular/material/core';

export type LibIconButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type LibIconButtonShape = 'round' | 'square';
/** Padding inline desde Figma. */
export type LibIconButtonSpace = 'narrow' | 'default' | 'wide';
export type LibIconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard' | 'action';

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
  space = input<LibIconButtonSpace>('default');
  disabled = input(false);
  toggle = input(false);
  selected = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');

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
  }));
}
