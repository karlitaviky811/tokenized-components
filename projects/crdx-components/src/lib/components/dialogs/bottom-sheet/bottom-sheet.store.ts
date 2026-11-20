import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { inject, Injectable, signal, Type, WritableSignal } from '@angular/core';
import { BottomSheet } from './bottom-sheet';

export interface BottomSheetConfig {
  showDragHandle?: boolean;
}

@Injectable({ providedIn: 'root' })
export class BottomSheetStore {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly dialogState: WritableSignal<'open' | 'closed'> = signal('closed');
  private currentDialogRef?: DialogRef<unknown, unknown>;

  open(content: Type<unknown>, config?: BottomSheetConfig): DialogRef<unknown, unknown> {
    this.dialogState.set('open');

    const strategy = this.overlay.position().global().bottom('0').centerHorizontally();

    this.currentDialogRef = this.dialog.open<unknown>(BottomSheet, {
      width: '100%',
      maxWidth: '40rem',
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'lib-bottom-sheet-backdrop',
      positionStrategy: strategy,
      data: {
        content,
        showDragHandle: config?.showDragHandle ?? true,
        dialogState: this.dialogState,
      },
    });

    // Dispara la animación de cierre al hacer click en el backdrop.
    // disableClose: true es necesario para que la animación corra antes de que
    // el CDK destruya el overlay; onAnimationDone llama a dialogRef.close().
    this.currentDialogRef.backdropClick.subscribe(() => {
      this.dialogState.set('closed');
    });

    return this.currentDialogRef;
  }

  close(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined;
    }
    this.dialogState.set('closed');
  }
}
