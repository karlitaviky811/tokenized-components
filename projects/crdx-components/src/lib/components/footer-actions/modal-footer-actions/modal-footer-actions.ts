import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibDividerComponent } from '../../divider/divider';

@Component({
  selector: 'lib-modal-footer-actions',
  standalone: true,
  imports: [LibDividerComponent],
  templateUrl: './modal-footer-actions.html',
  styleUrl: './modal-footer-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFooterActionsComponent {}
