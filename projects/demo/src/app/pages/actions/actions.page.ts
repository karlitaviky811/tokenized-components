import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibButtonComponent, LibIconButtonComponent, LibSlideToggleComponent, LibChipComponent } from 'crdx-components';

@Component({
  selector: 'app-actions-page',
  standalone: true,
  imports: [LibButtonComponent, LibIconButtonComponent, LibSlideToggleComponent, LibChipComponent],
  templateUrl: './actions.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsPage {
  filters = signal([
    { value: 'all', label: 'Todos', selected: true },
    { value: 'active', label: 'Activos', selected: false },
    { value: 'pending', label: 'Pendientes', selected: false },
    { value: 'closed', label: 'Cerrados', selected: false },
  ]);

  toggleFilter(value: string): void {
    this.filters.update(filters =>
      filters.map(f => ({ ...f, selected: f.value === value }))
    );
  }

  onChipRemoved(_label: string): void {
  }
}
