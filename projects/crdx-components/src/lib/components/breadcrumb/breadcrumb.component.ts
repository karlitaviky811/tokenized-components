import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibBreadcrumbComponent {
  private readonly route = inject(ActivatedRoute, { optional: true });

  readonly parentNavigate = output<string>();

  readonly parentLabel = signal('');
  readonly parentUrl = signal('');
  readonly currentLabel = signal('');

  constructor() {
    const route = this.route;
    if (!route) return;

    const parentData = route.parent?.snapshot.data ?? {};
    const currentData = route.snapshot.data ?? {};

    this.parentLabel.set(parentData['breadcrumb'] ?? currentData['parentBreadcrumb'] ?? '');
    this.parentUrl.set(parentData['url'] ?? currentData['parentUrl'] ?? '/');
    this.currentLabel.set(currentData['breadcrumb'] ?? '');
  }

  navigateToParent(): void {
    const target = this.parentUrl();
    if (target) {
      this.parentNavigate.emit(target);
    }
  }
}
