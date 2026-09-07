import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { LibButtonComponent, ConfirmModal } from 'crdx-components';

@Component({
  selector: 'app-dialogs-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './dialogs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsPage {
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