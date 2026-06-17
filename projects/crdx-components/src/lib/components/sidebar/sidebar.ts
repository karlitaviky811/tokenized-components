import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: string;
  iconPath?: string;
  accessoryIcon?: string;
  accessoryIconPath?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly items = input<readonly SidebarNavItem[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly showLabels = input(true);
  readonly spritePath = input('assets/icons/sprite.svg');

  @Output() readonly itemSelected = new EventEmitter<SidebarNavItem>();

  protected readonly hasLabels = computed(() => this.showLabels() && this.items().some(({ label }) => !!label));

  protected onSelect(item: SidebarNavItem): void {
    if (item.disabled) {
      return;
    }

    this.itemSelected.emit(item);
  }

  protected isSelected(item: SidebarNavItem): boolean {
    return item.id === this.selectedId();
  }

  protected trackById(_index: number, item: SidebarNavItem): string {
    return item.id;
  }

  protected iconHref(icon: string): string {
    return `${this.spritePath()}#${icon}`;
  }

  protected accessoryHref(accessoryIcon: string): string {
    return `${this.spritePath()}#${accessoryIcon}`;
  }

  protected iconRef(item: SidebarNavItem): string | null {
    if (item.iconPath) {
      return item.iconPath;
    }

    if (item.icon) {
      return this.iconHref(item.icon);
    }

    return null;
  }

  protected accessoryRef(item: SidebarNavItem): string | null {
    if (item.accessoryIconPath) {
      return item.accessoryIconPath;
    }

    if (item.accessoryIcon) {
      return this.accessoryHref(item.accessoryIcon);
    }

    return null;
  }

  protected isSprite(ref: string | null | undefined): ref is string {
    return !!ref && ref.includes('#');
  }

  protected shouldShowLabel(item: SidebarNavItem): boolean {
    if (!item.label) {
      return false;
    }

    return this.showLabels();
  }
}
