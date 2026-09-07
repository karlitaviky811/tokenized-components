import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-page',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.page.html',
  styleUrl: './breadcrumb.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPage {}
