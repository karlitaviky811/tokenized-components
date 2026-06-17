import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { NgTemplateOutlet } from '@angular/common';
import { LibCheckboxComponent } from '../checkbox/checkbox';

export interface LibListItemData {
  id: string;
  label: string;
  description?: string;
  avatarText?: string | null;
  avatarImage?: string | null;
  avatarAlt?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-list-item',
  standalone: true,
  imports: [MatListModule, MatCheckboxModule, LibCheckboxComponent, NgTemplateOutlet],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibListItemComponent {
  items = input<LibListItemData[]>([]);
  selectedIds = input<string[]>([]);
  multiple = input(true);
  disabled = input(false);
  showCheckbox = input(true);
  showAvatar = input(true);
  showDividers = input(true);
  /** Posición del checkbox: 'leading' (izquierda) o 'trailing' (derecha). Por defecto 'trailing' según diseño Figma. */
  checkboxPosition = input<'leading' | 'trailing'>('trailing');

  /** Ancho de la lista. Acepta valores CSS (ej: '18.8rem', '300px', '100%'). Si no se pasa, la lista ocupa el ancho disponible. */
  width = input<string | undefined>(undefined);
  /** Fondo personalizado de la lista/items. Si no se define, usa el fondo por defecto de tokens. */
  backgroundColor = input<string | undefined>(undefined);

  readonly selectionChange = output<string[]>();
  readonly itemClick = output<LibListItemData>();

  /** Template para proyectar contenido arriba de la lista (ej: checkbox, filtros) */
  readonly headerTemplate = contentChild<TemplateRef<unknown>>('headerTemplate');

  /** Template para proyectar el contenido personalizado de cada item. Usar: let-item para acceder al item */
  readonly itemTemplate = contentChild<TemplateRef<{ $implicit: LibListItemData }>>('itemTemplate');

  readonly selectedSet = computed(() => new Set(this.selectedIds()));

  trackById(_index: number, item: LibListItemData): string {
    return item.id;
  }

  avatarInitial(item: LibListItemData): string {
    const explicit = item.avatarText?.trim();
    if (explicit) {
      return explicit.slice(0, 2).toUpperCase();
    }

    const label = item.label?.trim();
    return label ? label.charAt(0).toUpperCase() : '';
  }

  isItemSelected(item: LibListItemData): boolean {
    return this.selectedSet().has(item.id);
  }

  onCheckboxChange(item: LibListItemData, selected: boolean): void {
    const current = new Set(this.selectedIds());
    if (this.multiple()) {
      if (selected) {
        current.add(item.id);
      } else {
        current.delete(item.id);
      }
    } else {
      this.selectionChange.emit(selected ? [item.id] : []);
      return;
    }
    this.selectionChange.emit([...current]);
  }

  onRowClick(item: LibListItemData, _event: Event): void {
    if (this.showCheckbox() && !(item.disabled ?? this.disabled())) {
      const isSelected = this.isItemSelected(item);
      this.onCheckboxChange(item, !isSelected);
    }
    this.itemClick.emit(item);
  }

  onItemClick(item: LibListItemData): void {
    this.itemClick.emit(item);
  }
}
