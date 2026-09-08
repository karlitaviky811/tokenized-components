import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Estilo del assist chip según MD3 (node Figma 261:718). */
export type LibAssistChipStyle = 'outlined' | 'elevated';

/**
 * Assist chip (Material Design 3).
 *
 * Representa acciones inteligentes o automáticas. NO tiene estado `selected`
 * (es una acción, no un toggle). Soporta leading icon opcional.
 *
 * Figma: .Assistive chip (261:718).
 */
@Component({
  selector: 'lib-assist-chip',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './assist-chip.html',
  styleUrl: './assist-chip.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibAssistChipComponent {
  readonly label = input('');

  /** `outlined` (borde, sin fondo) o `elevated` (fondo + sombra Elevation/1). */
  readonly appearance = input<LibAssistChipStyle>('outlined');

  readonly disabled = input(false);

  /** Nombre del ícono Material a mostrar como leading icon. Vacío = label only. */
  readonly icon = input('');

  protected readonly hasIcon = computed(() => !!this.icon());
}
