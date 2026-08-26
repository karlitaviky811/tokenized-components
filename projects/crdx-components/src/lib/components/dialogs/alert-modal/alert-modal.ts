import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-alert-modal, app-alert',
  templateUrl: './alert-modal.html',
  imports: [MatButton, MatIcon, CommonModule],
  styleUrl: './alert-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertModal {
  readonly dialogRef = inject(DialogRef);
  readonly data = inject(DIALOG_DATA);
  readonly labelButtonCancel = 'Entendido';

  onConfirm(): void {
    this.dialogRef.close(true);

  }
   onCancel(): void {
    this.dialogRef.close(false);

  }


}
