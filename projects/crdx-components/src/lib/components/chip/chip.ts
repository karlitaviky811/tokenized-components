import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

/**
 * Estilos del filter chip segun MD3.
 *
 * Se llama `appearance` y no `style` porque `style` colisiona con el atributo
 * nativo de HTML; ademas es el termino que ya usan mat-form-field y matButton.
 */
export type LibChipAppearance = 'outlined' | 'elevated';

@Component({
  selector: 'lib-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, NgClass],
  templateUrl: './chip.html',
  styleUrl: './chip.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibChipComponent {
  label = input('');

  /** Estilo del chip: `outlined` (borde, sin fondo) o `elevated` (fondo + sombra). */
  appearance = input<LibChipAppearance>('outlined');

  selected = input(false);
  disabled = input(false);

  /** Muestra el trailing icon de remover y habilita el output `removed`. */
  removable = input(false);

  /** Nombre del leading icon. Vacio = configuracion "label only". */
  icon = input('');

  readonly removed = output<void>();

  readonly classes = computed(() => ({
    'lib-chip--outlined': this.appearance() === 'outlined',
    'lib-chip--elevated': this.appearance() === 'elevated',
    'lib-chip--selected': this.selected(),
  }));

  onRemove(): void {
    this.removed.emit();
  }
}
