import type { Routes } from '@angular/router';

/** Lazy component loader, reusing Angular's own route typing. */
type LazyComponent = NonNullable<Routes[number]['loadComponent']>;

/**
 * One entry in the demo sidebar.
 *
 * `path` and `loadComponent` are absent for components that exist in the
 * design system but have no demo page yet (rendered as "soon").
 */
export interface NavItem {
  readonly label: string;
  readonly path?: string;
  readonly loadComponent?: LazyComponent;
  readonly data?: Record<string, unknown>;
}

/** A navigable entry: has both a route path and a component to load. */
export interface NavPage extends NavItem {
  readonly path: string;
  readonly loadComponent: LazyComponent;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

/** Narrows a nav item to one that can produce a route. */
export function isNavPage(item: NavItem): item is NavPage {
  return item.path !== undefined && item.loadComponent !== undefined;
}

/** Path the app lands on when no route is given. */
export const DEFAULT_PATH = 'button';

/**
 * Single source of truth for the demo: drives both the sidebar navigation
 * (app.component.ts) and the router configuration (app.routes.ts).
 *
 * Add a component here once and it appears in both places.
 */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Actions',
    items: [
      { label: 'Buttons',      path: 'button',       loadComponent: () => import('./pages/button/button.page').then(m => m.ButtonPage) },
      { label: 'Icon Buttons', path: 'icon-button',  loadComponent: () => import('./pages/icon-button/icon-button.page').then(m => m.IconButtonPage) },
      { label: 'Slide Toggle', path: 'slide-toggle', loadComponent: () => import('./pages/slide-toggle/slide-toggle.page').then(m => m.SlideTogglePage) },
      { label: 'Chips',        path: 'chip',         loadComponent: () => import('./pages/chip/chip.page').then(m => m.ChipPage) },
    ],
  },
  {
    label: 'Inputs',
    items: [
      { label: 'Text Fields',   path: 'text-field',   loadComponent: () => import('./pages/text-field/text-field.page').then(m => m.TextFieldPage) },
      { label: 'Select',        path: 'select-field', loadComponent: () => import('./pages/select-field/select-field.page').then(m => m.SelectFieldPage) },
      { label: 'Checkboxes',    path: 'checkbox',     loadComponent: () => import('./pages/checkbox/checkbox.page').then(m => m.CheckboxPage) },
      { label: 'Radio Buttons', path: 'radio-button', loadComponent: () => import('./pages/radio-button/radio-button.page').then(m => m.RadioButtonPage) },
      { label: 'Date Picker',   path: 'date-picker',  loadComponent: () => import('./pages/date-picker/date-picker.page').then(m => m.DatePickerPage) },
    ],
  },
  {
    label: 'Data Display',
    items: [
      { label: 'Cards',      path: 'card',         loadComponent: () => import('./pages/card/card.page').then(m => m.CardPage) },
      { label: 'Breadcrumb', path: 'breadcrumb',   loadComponent: () => import('./pages/breadcrumb/breadcrumb.page').then(m => m.BreadcrumbPage), data: { breadcrumb: 'Breadcrumb', parentBreadcrumb: 'Componentes', parentUrl: '/button' } },
      { label: 'Table',      path: 'shared-table', loadComponent: () => import('./pages/shared-table/shared-table.page').then(m => m.SharedTablePage) },
      { label: 'List Item',  path: 'list-item',    loadComponent: () => import('./pages/list-item/list-item.page').then(m => m.ListItemPage) },
      { label: 'Badges',     path: 'badges',       loadComponent: () => import('./pages/badges/badges.page').then(m => m.BadgesPage) },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { label: 'Spinner',               path: 'spinner',              loadComponent: () => import('./pages/spinner/spinner.page').then(m => m.SpinnerPage) },
      { label: 'Tooltip',               path: 'tooltip',              loadComponent: () => import('./pages/tooltip/tooltip.page').then(m => m.TooltipPage) },
      { label: 'Progress Stepper',      path: 'progress-stepper',     loadComponent: () => import('./pages/progress-stepper/progress-stepper.page').then(m => m.ProgressStepperPage) },
      { label: 'Progress Indicators',   path: 'progress-indicator',   loadComponent: () => import('./pages/progress-indicator/progress-indicator.page').then(m => m.ProgressIndicatorPage) },
      { label: 'Snackbars',             path: 'snackbar',             loadComponent: () => import('./pages/snackbar/snackbar.page').then(m => m.SnackbarPage) },
    ],
  },
  {
    label: 'Layout',
    items: [
      { label: 'App Bar', path: 'app-bar',     loadComponent: () => import('./pages/app-bar/app-bar.page').then(m => m.AppBarPage) },
      { label: 'Divider', path: 'divider',     loadComponent: () => import('./pages/divider/divider.page').then(m => m.DividerPage) },
      { label: 'Sidebar', path: 'lib-sidebar', loadComponent: () => import('./pages/lib-sidebar/lib-sidebar.page').then(m => m.LibSidebarPage) },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { label: 'Dialogs',        path: 'confirm-modal',  loadComponent: () => import('./pages/confirm-modal/confirm-modal.page').then(m => m.ConfirmModalPage) },
      { label: 'Dynamic Dialog', path: 'dynamic-dialog', loadComponent: () => import('./pages/dynamic-dialog/dynamic-dialog.page').then(m => m.DynamicDialogPage) },
      { label: 'Side Sheets',    path: 'side-modal',     loadComponent: () => import('./pages/side-modal/side-modal.page').then(m => m.SideModalPage) },
      { label: 'Bottom Sheets',  path: 'bottom-sheet',   loadComponent: () => import('./pages/bottom-sheet/bottom-sheet.page').then(m => m.BottomSheetPage) },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Tabs', path: 'tabs', loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage) },
      { label: 'Menu', path: 'menu', loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage) },
    ],
  },
  {
    label: 'Mobile',
    items: [
      { label: 'Mobile Preview', path: 'mobile-preview', loadComponent: () => import('./pages/mobile-preview/mobile-preview.page').then(m => m.MobilePreviewPage) },
    ],
  },
  {
    label: 'Coming Soon',
    items: [
      { label: 'Avatars'         },
      { label: 'Carousel'        },
      { label: 'Navigation Rail' },
      { label: 'Search'          },
    ],
  },
];
