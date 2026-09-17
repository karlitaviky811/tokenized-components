import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';

export interface DynamicDialogData {
  headerTemplate?: TemplateRef<unknown>;
  bodyTemplate?: TemplateRef<unknown>;
  actionsTemplate?: TemplateRef<unknown>;
}

@Component({
  selector: 'lib-dynamic-dialog',
  templateUrl: './dynamic-dialog.html',
  imports: [NgTemplateOutlet],
  styleUrl: './dynamic-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDialog {
  readonly dialogRef = inject(DialogRef);
  readonly data: DynamicDialogData = inject(DIALOG_DATA) as DynamicDialogData;
}
