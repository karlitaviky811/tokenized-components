import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <nav class="shell__nav">
        <h1 class="shell__title">CRDX Components</h1>
        @for (link of navLinks; track link.path) {
          <a class="shell__link"
             [routerLink]="link.path"
             routerLinkActive="shell__link--active">
            {{ link.label }}
          </a>
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
      background: #1e1e2e; color: #cdd6f4;
      padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.25rem;
      overflow-y: auto;
    }
    .shell__title { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: #fff; }
    .shell__link {
      display: block; padding: 0.5rem 0.75rem; border-radius: 6px;
      text-decoration: none; color: #bac2de; font-size: 0.875rem;
      transition: background 0.15s;
    }
    .shell__link:hover { background: #313244; }
    .shell__link--active { background: #45475a; color: #fff; font-weight: 500; }
    .shell__content { flex: 1; overflow-y: auto; padding: 2rem; }
  `],
})
export class AppComponent {
  navLinks = [
    { path: 'actions', label: 'Actions' },
    { path: 'inputs', label: 'Inputs' },
    { path: 'data-display', label: 'Data Display' },
    { path: 'feedback', label: 'Feedback' },
    { path: 'layout', label: 'Layout' },
    { path: 'dialogs', label: 'Dialogs' },
  ];
}
