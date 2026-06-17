import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'actions', pathMatch: 'full' },
  { path: 'actions', loadComponent: () => import('./pages/actions/actions.page').then(m => m.ActionsPage) },
  { path: 'inputs', loadComponent: () => import('./pages/inputs/inputs.page').then(m => m.InputsPage) },
  { path: 'data-display', loadComponent: () => import('./pages/data-display/data-display.page').then(m => m.DataDisplayPage) },
  { path: 'feedback', loadComponent: () => import('./pages/feedback/feedback.page').then(m => m.FeedbackPage) },
  { path: 'layout', loadComponent: () => import('./pages/layout/layout.page').then(m => m.LayoutPage) },
  { path: 'dialogs', loadComponent: () => import('./pages/dialogs/dialogs.page').then(m => m.DialogsPage) },
];
