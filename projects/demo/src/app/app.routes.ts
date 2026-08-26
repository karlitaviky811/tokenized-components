import { Routes } from '@angular/router';
import { DEFAULT_PATH, NAV_GROUPS, isNavPage } from './app.nav';

/**
 * Routes are derived from NAV_GROUPS so navigation and routing can never drift.
 * To add a page, edit app.nav.ts — not this file.
 */
export const APP_ROUTES: Routes = [
  { path: '', redirectTo: DEFAULT_PATH, pathMatch: 'full' },
  ...NAV_GROUPS.flatMap(group =>
    group.items.filter(isNavPage).map(({ path, loadComponent }) => ({ path, loadComponent })),
  ),
];
