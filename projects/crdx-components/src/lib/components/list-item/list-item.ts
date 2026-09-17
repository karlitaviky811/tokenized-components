import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgTemplateOutlet } from '@angular/common';
import { LibCheckboxComponent } from '../checkbox/checkbox';

/** Qué se muestra al final (derecha) de cada item.
 *  - 'checkbox': selección (comportamiento histórico).
 *  - 'icon': un ícono de acción/navegación (ej. chevron_right).
 *  - 'none': sin elemento trailing. */
export type LibListItemTrailing = 'checkbox' | 'icon' | 'none';

/** Densidad vertical del item. 'default' ≈ 56px, 'compact' ≈ 40px (Figma). */
export type LibListItemDensity = 'default' | 'compact';

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
  imports: [MatListModule, MatIconModule, LibCheckboxComponent, NgTemplateOutlet],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibListItemComponent {
  data = input.required<LibListItemData>();
  selected = input(false);
  disabled = input(false);
  showAvatar = input(true);
  showCheckbox = input(true);
  checkboxPosition = input<'leading' | 'trailing'>('trailing');
  trailingType = input<LibListItemTrailing>('checkbox');
  trailingIcon = input<string>('chevron_right');
  density = input<LibListItemDensity>('default');
  trailingTemplate = input<TemplateRef<{ $implicit: LibListItemData }> | null>(null);

  readonly selectedChange = output<boolean>();
  readonly rowClick = output<void>();

  readonly effectiveTrailingCheckbox = computed(
    () => !this.trailingTemplate() && this.trailingType() === 'checkbox' && this.showCheckbox(),
  );

  readonly effectiveTrailingIcon = computed(
    () => !this.trailingTemplate() && this.trailingType() === 'icon',
  );

  readonly avatarInitial = computed((): string => {
    const item = this.data();
    const explicit = item.avatarText?.trim();
    if (explicit) return explicit.slice(0, 2).toUpperCase();
    const label = item.label?.trim();
    return label ? label.charAt(0).toUpperCase() : '';
  });
}
