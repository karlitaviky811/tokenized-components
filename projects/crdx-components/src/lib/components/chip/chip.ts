import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export type LibChipVariant = 'filled' | 'outlined';
export type LibChipSize = 'small' | 'medium';

@Component({
  selector: 'lib-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, NgClass],
  templateUrl: './chip.html',
  styleUrl: './chip.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibChipComponent {
  label = input('');
  variant = input<LibChipVariant>('outlined');
  size = input<LibChipSize>('medium');
  selected = input(false);
  disabled = input(false);
  removable = input(false);
  icon = input('');

  readonly removed = output<void>();

  readonly classes = computed(() => ({
    'lib-chip--filled': this.variant() === 'filled',
    'lib-chip--outlined': this.variant() === 'outlined',
    'lib-chip--small': this.size() === 'small',
    'lib-chip--medium': this.size() === 'medium',
    'lib-chip--selected': this.selected(),
  }));

  onRemove(): void {
    this.removed.emit();
  }
}
