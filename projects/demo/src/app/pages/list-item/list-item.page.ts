import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibListItemComponent, LibListItemData } from 'crdx-components';

@Component({
  selector: 'app-list-item-page',
  standalone: true,
  imports: [LibListItemComponent],
  templateUrl: './list-item.page.html',
  styleUrl: './list-item.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemPage {
  protected readonly items = signal<LibListItemData[]>([
    { id: '1', label: 'Usuario 1', description: 'usuario1@email.com', avatarText: 'U1' },
    { id: '2', label: 'Usuario 2', description: 'usuario2@email.com', avatarText: 'U2' },
    { id: '3', label: 'Usuario 3', description: 'usuario3@email.com', avatarText: 'U3' },
    { id: '4', label: 'Usuario 4', description: 'usuario4@email.com', avatarText: 'U4' },
  ]);

  selectedIds = signal<string[]>([]);

  onSelectionChange(ids: string[]): void {
    this.selectedIds.set(ids);
  }
}