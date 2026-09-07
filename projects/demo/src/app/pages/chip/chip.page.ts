import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibChipComponent } from 'crdx-components';

@Component({
  selector: 'app-chip-page',
  standalone: true,
  imports: [LibChipComponent],
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
}
