import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { resolveUiIconResource, UiIconName, UI_ICON_NAMES } from '../../icons/register-icons';

export interface HeaderAction {
  icon: string;
  ariaLabel: string;
  id?: string;
  iconPath?: string;
}

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly showLeading = input(true);
  readonly leadingIcon = input('icon-menu');
  readonly leadingIconPath = input<string | null>(null);
  readonly leadingActionLabel = input('Abrir navegación');
  readonly brandLabel = input('Credix');
  readonly brandIcon = input('smiley');
  readonly brandIconPath = input<string | null>(null);
  readonly trailingActions = input<readonly HeaderAction[]>([
    { icon: 'search', ariaLabel: 'Abrir buscador' },
  ]);
  readonly iconBasePath = input('assets/icons');

  @Output() readonly leadingClick = new EventEmitter<void>();
  @Output() readonly actionClick = new EventEmitter<HeaderAction>();

  protected readonly iconAssetBasePath = computed(() =>
    this.normalizeAssetBasePath(this.iconBasePath())
  );

  protected readonly leadingIconUrl = computed(() =>
    this.resolveIconUrl(this.leadingIcon(), this.leadingIconPath())
  );

  protected readonly brandIconUrl = computed(() =>
    this.resolveIconUrl(this.brandIcon(), this.brandIconPath())
  );

  protected onLeadingClick(): void {
    this.leadingClick.emit();
  }

  protected onActionClick(action: HeaderAction): void {
    this.actionClick.emit(action);
  }

  protected trackByAction(_index: number, action: HeaderAction): string {
    return action.id ?? action.icon;
  }

  protected actionIconUrl(action: HeaderAction): string | null {
    return this.resolveIconUrl(action.icon, action.iconPath ?? null);
  }

  private resolveIconUrl(iconName: string | null | undefined, explicitPath: string | null): string | null {
    if (explicitPath) {
      if (explicitPath.includes('#')) {
        const spriteSymbol = explicitPath.split('#')[1];
        if (spriteSymbol) {
          const fallback = this.resolveIconUrl(spriteSymbol, null);
          if (fallback) {
            return fallback;
          }
        }
      }
      return explicitPath;
    }

    if (!iconName) {
      return null;
    }

    if (KNOWN_UI_ICON_NAMES.has(iconName as UiIconName)) {
      return resolveUiIconResource(iconName as UiIconName, {
        basePath: this.iconAssetBasePath(),
      });
    }

    return `${this.iconAssetBasePath()}/${iconName}.svg`;
  }

  private normalizeAssetBasePath(basePath: string | null | undefined): string {
    const targetPath = basePath ?? 'assets/icons';

    if (/^(https?:)?\/\//.test(targetPath)) {
      return targetPath.replace(/\/$/, '');
    }

    return targetPath.replace(/\/$/, '');
  }
}

const KNOWN_UI_ICON_NAMES = new Set<UiIconName>(UI_ICON_NAMES);
