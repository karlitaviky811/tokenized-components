import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibChipComponent, LibAssistChipComponent, LibSuggestionChipComponent } from 'crdx-components';

@Component({
  selector: 'app-chip-page',
  standalone: true,
  imports: [LibChipComponent, LibAssistChipComponent, LibSuggestionChipComponent],
  templateUrl: './chip.page.html',
  styleUrl: './chip.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipPage {
  filters = signal([
    { value: 'all',     label: 'Todos',      selected: true  },
    { value: 'active',  label: 'Activos',    selected: false },
    { value: 'pending', label: 'Pendientes', selected: false },
    { value: 'closed',  label: 'Cerrados',   selected: false },
  ]);

  toggleFilter(value: string): void {
    this.filters.update(fs => fs.map(f => ({ ...f, selected: f.value === value })));
  }

  /** Suggestion chips interactivos: cada uno toglea de forma independiente. */
  suggestions = signal([
    { value: 'react',   label: 'React',   selected: false },
    { value: 'angular', label: 'Angular', selected: true  },
    { value: 'vue',     label: 'Vue',     selected: false },
  ]);

  toggleSuggestion(value: string, selected: boolean): void {
    this.suggestions.update(ss => ss.map(s => (s.value === value ? { ...s, selected } : s)));
  }
}
