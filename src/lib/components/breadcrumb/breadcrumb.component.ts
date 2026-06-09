import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'lib-breadcrumb, shared-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedBreadcrumbComponent implements OnInit {
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly router = inject(Router, { optional: true });
  @Output() parentNavigate = new EventEmitter<string>();

  readonly parentLabel = signal<string>('');
  readonly parentUrl = signal<string>('');
  readonly currentLabel = signal<string>('');

  ngOnInit(): void {
    const currentRoute = this.route;
    if (!currentRoute) {
      return;
    }

    const parentRoute = currentRoute.parent;
    const parentData = parentRoute?.snapshot.data ?? {};
    const currentData = currentRoute.snapshot.data ?? {};

    const parentLabel = parentData['breadcrumb'] ?? currentData['parentBreadcrumb'] ?? '';
    const parentUrl = parentData['url'] ?? currentData['parentUrl'] ?? '/';
    const currentLabel = currentData['breadcrumb'] ?? '';

    this.parentLabel.set(parentLabel);
    this.parentUrl.set(parentUrl);
    this.currentLabel.set(currentLabel);
  }

  navigateToParent(): void {
    const target = this.parentUrl();
    if (target) {
      this.parentNavigate.emit(target);
    }
  }
}

