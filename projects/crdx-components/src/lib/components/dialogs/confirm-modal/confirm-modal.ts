import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { LibButtonComponent } from '../../button/button';

export interface ConfirmModalData {
  title: string;
  reference?: string;
  content?: string;
  description?: string;
  showTopIcon?: boolean;
  topIconName?: string;
  labelButtonCancel?: string;
  labelButtonConfirm: string;
  primaryFilled?: boolean;
  bodyTemplate?: TemplateRef<unknown>;
}

@Component({
  selector: 'lib-confirm',
  templateUrl: './confirm-modal.html',
  imports: [LibButtonComponent, MatIconModule, NgTemplateOutlet],
  styleUrl: './confirm-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModal {
  readonly dialogRef = inject(DialogRef);
  readonly data: ConfirmModalData = inject(DIALOG_DATA) as ConfirmModalData;

  readonly labelButtonCancel = this.data.labelButtonCancel ?? 'Cancelar';
  readonly supportingText = this.data.description ?? this.data.content ?? this.data.reference ?? '';
  readonly isBasicVariant = !this.data.bodyTemplate;
  readonly topIconName = this.data.topIconName ?? 'check_box';

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
