import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <nav class="shell__nav">
        <h1 class="shell__title">Components</h1>
        @for (item of navItems; track item.label) {
          @if (item.path) {
            <a class="shell__link"
               [routerLink]="item.path"
               routerLinkActive="shell__link--active">
              {{ item.label }}
              <span class="shell__arrow">→</span>
            </a>
          } @else {
            <span class="shell__link shell__link--disabled">
              {{ item.label }}
              <span class="shell__arrow">→</span>
            </span>
          }
        }
      </nav>
      <main class="shell__content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell { display: flex; height: 100vh; }

    .shell__nav {
      width: 220px; min-width: 220px;
      background: #CBE8EB;
      padding: 1.25rem 0.75rem 1.25rem 1rem;
      display: flex; flex-direction: column; gap: 2px;
      overflow-y: auto;
      border-right: 1px solid #A8D4D8;
    }

    .shell__title {
      font-size: 1rem; font-weight: 700;
      margin: 0 0 0.75rem 0.25rem;
      color: #181C1E;
      font-family: 'Heebo', sans-serif;
    }

    .shell__link {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.3rem 0.5rem; border-radius: 4px;
      text-decoration: none; color: #181C1E;
      font-size: 0.875rem; font-family: 'Heebo', sans-serif;
      transition: background 0.12s;
      cursor: pointer;
    }

    .shell__link:hover:not(.shell__link--disabled) { background: rgba(0,0,0,0.07); }

    .shell__link--active {
      background: rgba(0,0,0,0.10);
      font-weight: 600;
    }

    .shell__link--disabled {
      color: #74787A;
      cursor: default;
      opacity: 0.6;
    }

    .shell__arrow { font-size: 0.8rem; opacity: 0.55; }

    .shell__content { flex: 1; overflow-y: auto; padding: 2rem; }
  `],
})
export class AppComponent {
  navItems: NavItem[] = [
    { label: 'Avatars' },
    { label: 'App bars',            path: 'layout' },
    { label: 'Badges' },
    { label: 'Bottom sheets' },
    { label: 'Buttons',             path: 'actions' },
    { label: 'Cards',               path: 'data-display' },
    { label: 'Carousel' },
    { label: 'Checkboxes',          path: 'inputs' },
    { label: 'Chips',               path: 'inputs' },
    { label: 'Date picker',          path: 'date-picker' },
    { label: 'Dialogs',             path: 'dialogs' },
    { label: 'Dividers',            path: 'layout' },
    { label: 'Icon buttons',        path: 'actions' },
    { label: 'Lists',               path: 'inputs' },
    { label: 'Menus',               path: 'inputs' },
    { label: 'Navigation rail' },
    { label: 'Progress indicators', path: 'feedback' },
    { label: 'Radio buttons',       path: 'inputs' },
    { label: 'Search' },
    { label: 'Side sheets',         path: 'dialogs' },
    { label: 'Snackbars' },
    { label: 'Switch',              path: 'inputs' },
    { label: 'Tabs' },
    { label: 'Text fields',         path: 'inputs' },
    { label: 'Tooltips',            path: 'inputs' },
  ];
}
