import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { LibButtonComponent } from '../../button/button';

export type ConfirmModalVariant = 'basic' | 'list' | 'scrollable-list';

export interface ConfirmModalListItem {
  id: string;
  label: string;
  supportingText?: string;
  amount?: string;
  selected?: boolean;
}

export interface ConfirmModalData {
  title: string;
  reference?: string;
  content?: string;
  description?: string;
  showTopIcon?: boolean;
  topIconName?: string;
  variant?: ConfirmModalVariant;
  listItems?: ConfirmModalListItem[];
  labelButtonCancel?: string;
  labelButtonConfirm: string;
}

@Component({
  selector: 'lib-confirm',
  templateUrl: './confirm-modal.html',
  imports: [LibButtonComponent, MatIconModule],
  styleUrl: './confirm-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModal {
  readonly dialogRef = inject(DialogRef);
  readonly data: ConfirmModalData = inject(DIALOG_DATA) as ConfirmModalData;
  readonly listItems = signal<ConfirmModalListItem[]>(this.data.listItems ?? []);

  readonly labelButtonCancel = this.data.labelButtonCancel ?? 'Cancelar';

  readonly supportingText = this.data.description ?? this.data.content ?? this.data.reference ?? '';

  readonly isListVariant = this.data.variant === 'list' || this.data.variant === 'scrollable-list';
  readonly isScrollableList = this.data.variant === 'scrollable-list';

  readonly topIconName = this.data.topIconName ?? 'check_box';

  toggleListItem(itemId: string): void {
    this.listItems.update((items) =>
      items.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item))
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
