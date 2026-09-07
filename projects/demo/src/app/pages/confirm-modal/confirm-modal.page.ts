import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { LibButtonComponent, ConfirmModal } from 'crdx-components';

@Component({
  selector: 'app-confirm-modal-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './confirm-modal.page.html',
  styleUrl: './confirm-modal.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalPage {
  private readonly dialog = inject(Dialog);

  openConfirm(): void {
    this.dialog.open(ConfirmModal, {
      data: {
        title: '¿Confirmar acción?',
        content: 'Esto es una demostración del modal de confirmación.',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Confirmar',
      },
    });
  }
}
