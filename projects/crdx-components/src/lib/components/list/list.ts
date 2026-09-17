import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { LibListItemComponent } from '../list-item/list-item';
import { LibListItemData, LibListItemTrailing, LibListItemDensity } from '../list-item/list-item';
import { LibDividerComponent } from '../divider/divider';

@Component({
  selector: 'lib-list',
  standalone: true,
  imports: [MatListModule, NgTemplateOutlet, LibListItemComponent, LibDividerComponent],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibListComponent {
  items = input<LibListItemData[]>([]);
  selectedIds = input<string[]>([]);
  multiple = input(true);
  disabled = input(false);
  showCheckbox = input(true);
  showAvatar = input(true);
  showDividers = input(true);
  checkboxPosition = input<'leading' | 'trailing'>('trailing');
  trailingType = input<LibListItemTrailing>('checkbox');
  trailingIcon = input<string>('chevron_right');
  density = input<LibListItemDensity>('default');
  width = input<string | undefined>(undefined);
  backgroundColor = input<string | undefined>(undefined);

  readonly selectionChange = output<string[]>();
  readonly itemClick = output<LibListItemData>();

  readonly headerTemplate = contentChild<TemplateRef<unknown>>('headerTemplate');
  readonly itemTemplate = contentChild<TemplateRef<{ $implicit: LibListItemData }>>('itemTemplate');
  readonly trailingTemplate = contentChild<TemplateRef<{ $implicit: LibListItemData }>>('trailingTemplate');

  readonly selectedSet = computed(() => new Set(this.selectedIds()));

  trackById(_index: number, item: LibListItemData): string {
    return item.id;
  }

  isItemSelected(item: LibListItemData): boolean {
    return this.selectedSet().has(item.id);
  }

  onSelectedChange(item: LibListItemData, selected: boolean): void {
    const current = new Set(this.selectedIds());
    if (this.multiple()) {
      if (selected) current.add(item.id);
      else current.delete(item.id);
    } else {
      this.selectionChange.emit(selected ? [item.id] : []);
      return;
    }
    this.selectionChange.emit([...current]);
  }

  onRowClick(item: LibListItemData): void {
    if (
      this.trailingType() === 'checkbox' &&
      !this.trailingTemplate() &&
      !(item.disabled ?? this.disabled())
    ) {
      this.onSelectedChange(item, !this.isItemSelected(item));
    }
    this.itemClick.emit(item);
  }
}
