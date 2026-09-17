import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibListComponent, LibListItemData, LibIconButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-list-item-page',
  standalone: true,
  imports: [LibListComponent, LibIconButtonComponent],
  templateUrl: './list-item.page.html',
  styleUrl: './list-item.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemPage {
  protected readonly items = signal<LibListItemData[]>([
    { id: '1', label: 'Usuario 1', description: 'usuario1@email.com', avatarImage: 'assets/icons/generic_avatar.svg' },
    { id: '2', label: 'Usuario 2', description: 'usuario2@email.com', avatarImage: 'assets/icons/generic_avatar.svg' },
    { id: '3', label: 'Usuario 3', description: 'usuario3@email.com', avatarImage: 'assets/icons/generic_avatar.svg' },
    { id: '4', label: 'Usuario 4', description: 'usuario4@email.com', avatarImage: 'assets/icons/generic_avatar.svg' },
  ]);

  /** Diseño Figma "Menu (baseline)" 4215:4452 — lista de opciones sobre superficie. */
  protected readonly menuItems = signal<LibListItemData[]>([
    { id: 'm1', label: 'Menu item' },
    { id: 'm2', label: 'Menu item' },
    { id: 'm3', label: 'Menu item' },
    { id: 'm4', label: 'Menu item' },
  ]);

  protected readonly threeLineItems = signal<LibListItemData[]>([
    {
      id: 't1',
      label: 'List item',
      description: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
    },
    {
      id: 't2',
      label: 'Título del elemento',
      description: 'Descripción secundaria con más contexto del elemento seleccionado.',
    },
    {
      id: 't3',
      label: 'Otro elemento',
      description: 'Texto de soporte adicional que puede ocupar dos líneas de contenido.',
    },
  ]);

  selectedIds = signal<string[]>([]);

  onSelectionChange(ids: string[]): void {
    this.selectedIds.set(ids);
  }

  onItemClick(item: LibListItemData): void {
    console.log('list item click', item.id);
  }
}