import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LibBreadcrumbComponent } from 'crdx-components';

@Component({
  selector: 'app-breadcrumb-page',
  standalone: true,
  imports: [LibBreadcrumbComponent],
  templateUrl: './breadcrumb.page.html',
  styleUrl: './breadcrumb.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPage {
  private readonly router = inject(Router);

  navigate(url: string): void {
    this.router.navigateByUrl(url);
  }
}
