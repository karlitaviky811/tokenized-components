import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibDividerComponent } from '../../divider/divider';

@Component({
  selector: 'lib-page-footer-actions',
  standalone: true,
  imports: [LibDividerComponent],
  templateUrl: './page-footer-actions.html',
  styleUrl: './page-footer-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFooterActionsComponent {}
