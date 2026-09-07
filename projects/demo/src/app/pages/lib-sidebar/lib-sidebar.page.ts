import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibSidebarComponent, SidebarNavItem } from 'crdx-components';

/** Íconos inline (data-URI) para que los ejemplos sean autocontenidos, sin sprite ni assets. */
const icon = (paths: string): string =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  );

const ICON_HOME = icon('<path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>');
const ICON_SEARCH = icon('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>');
const ICON_CHART = icon('<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8"/><rect x="13" y="6" width="3" height="12"/>');
const ICON_SETTINGS = icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>');
const ICON_MAIL = icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>');
const ICON_USER = icon('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/>');

@Component({
  selector: 'app-lib-sidebar-page',
  standalone: true,
  imports: [LibSidebarComponent],
  templateUrl: './lib-sidebar.page.html',
  styleUrl: './lib-sidebar.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSidebarPage {
  readonly navItems: readonly SidebarNavItem[] = [
    { id: 'home', label: 'Inicio', icon: '', iconPath: ICON_HOME },
    { id: 'search', label: 'Buscar', icon: '', iconPath: ICON_SEARCH },
    { id: 'reports', label: 'Reportes', icon: '', iconPath: ICON_CHART },
    { id: 'messages', label: 'Mensajes', icon: '', iconPath: ICON_MAIL },
    { id: 'profile', label: 'Perfil', icon: '', iconPath: ICON_USER },
    { id: 'settings', label: 'Ajustes', icon: '', iconPath: ICON_SETTINGS },
  ];

  readonly selectedId = signal<string>('home');

  onSelect(item: SidebarNavItem): void {
    this.selectedId.set(item.id);
  }
}
