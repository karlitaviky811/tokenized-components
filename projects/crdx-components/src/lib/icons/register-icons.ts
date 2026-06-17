import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

const DEFAULT_ICON_BASE_PATH = 'assets/icons';

const ICON_MENU_FILE = 'icon-menu.svg';
const LOGO_FILE = 'logo.svg';
const SMILEY_FILE = 'smiley.svg';

const ICON_FILE_MAP = Object.freeze({
  CollapseMenu: ICON_MENU_FILE,
  'collapse-menu': ICON_MENU_FILE,
  'icon-menu': ICON_MENU_FILE,

  logo: LOGO_FILE,
  'credix-logo': LOGO_FILE,
  smiley: SMILEY_FILE,
'error-circle': 'error-circle.svg',
'info-error': 'info-error.svg',
  'configuration-countable': 'configuration-countable.svg',
  edit: 'edit.svg',
  'edit-table': 'edit-table.svg',
  hub: 'hub.svg',
  logout: 'logout.svg',
  notifications: 'notifications.svg',
  profile: 'profile.svg',
  'profile-user-menu': 'profile-user-menu.svg',
  visibility: 'visibility-eye.svg',
  check: 'success-check_icon.svg',
  'gif-icon-massive': 'gif-icon.svg',
  'background-color-massive': 'background-color-massive.svg',
  'content-edit-massive': 'trailing-icon.svg',
  'edit-massive': 'edit-massive.svg',
  'edit-massive-white': 'edit-white.svg',
  'edit-gray': 'edit-gray.svg',
  'check-update': 'check-update.svg',
  'download-simple': 'download-simple.svg',
  'download-file': 'download-file.svg',
  'content-copy': 'content-copy.svg',
  'add-create': 'add-create.svg',
  'add-create-dark': 'add-create-dark.svg',
  'add-create-dark-icon': 'add-create-dark-icon.svg',
  'add-circle-filled': 'add_circle_filled.svg',
  'add-circle-tonal': 'add_circle_tonal.svg',
  'add-circle-outlined': 'add_circle_outline.svg',
  'add-circle-elevated': 'add_circle_text.svg',
  'add-circle-text': 'add_circle_text.svg',
} satisfies Record<string, string>);

function normalizeBasePath(basePath?: string): string {
  const targetPath = basePath ?? DEFAULT_ICON_BASE_PATH;

  if (/^(https?:)?\/\//.test(targetPath)) {
    return targetPath.replace(/\/$/, '');
  }

  return targetPath.replace(/\/$/, '');
}

export type UiIconName = keyof typeof ICON_FILE_MAP;

export const UI_ICON_NAMES = Object.keys(ICON_FILE_MAP) as UiIconName[];

export interface RegisterUiIconOptions {
  basePath?: string;
}

export function resolveUiIconResource(
  iconName: UiIconName,
  options?: RegisterUiIconOptions
): string {
  const fileName = ICON_FILE_MAP[iconName];

  if (!fileName) {
    throw new Error(`Icon "${iconName}" is not registered in ICON_FILE_MAP.`);
  }

  return `${normalizeBasePath(options?.basePath)}/${fileName}`;
}

export function registerUiIcons(
  registry: MatIconRegistry,
  sanitizer: DomSanitizer,
  icons: UiIconName[] = UI_ICON_NAMES,
  options?: RegisterUiIconOptions
): void {
  const basePath = normalizeBasePath(options?.basePath);

  icons.forEach((iconName) => {
    const fileName = ICON_FILE_MAP[iconName];
    if (!fileName) {
      return;
    }

    const resourceUrl = `${basePath}/${fileName}`;
    registry.addSvgIcon(
      iconName,
      sanitizer.bypassSecurityTrustResourceUrl(resourceUrl)
    );
  });
}
