import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Estilo del suggestion chip según MD3 (node Figma 261:71). */
export type LibSuggestionChipStyle = 'outlined' | 'elevated';

/**
 * Suggestion chip (Material Design 3).
 *
 * Presenta sugerencias generadas dinámicamente para acotar la intención del
 * usuario. A diferencia del assist chip, SÍ tiene estado `selected` (toggle).
 *
 * Figma: .Suggestion chip (261:71).
 */
@Component({
  selector: 'lib-suggestion-chip',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './suggestion-chip.html',
  styleUrl: './suggestion-chip.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSuggestionChipComponent {
  readonly label = input('');

  /** `outlined` (borde) o `elevated` (fondo + sombra). */
  readonly appearance = input<LibSuggestionChipStyle>('outlined');

  readonly selected = input(false);
  readonly disabled = input(false);

  /** Nombre del ícono Material a mostrar como leading icon. */
  readonly icon = input('');

  readonly selectedChange = output<boolean>();

  protected readonly hasIcon = computed(() => !!this.icon());

  protected onToggle(): void {
    if (this.disabled()) {
      return;
    }
    this.selectedChange.emit(!this.selected());
  }
}
