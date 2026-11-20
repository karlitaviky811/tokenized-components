import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-error-modal, app-error-modal',
  imports: [MatButtonModule],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModal {
  private readonly dialogRef = inject(DialogRef);
  readonly data = inject(DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);

  }

}
