import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { inject, Injectable, signal, Type, WritableSignal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContainerCustom } from './container-custom';

export interface ModalData {
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class CustomModalStore {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  readonly dialogState: WritableSignal<'open' | 'closed'> = signal('open');
  private currentDialogRef?: DialogRef<string, unknown>;
  private readonly router = inject(Router);
  private navSub?: Subscription;

  openCustomModal(content: Type<unknown>, width: string, modalData?: ModalData): DialogRef<string, unknown> {
    this.navSub?.unsubscribe();
    this.dialogState.set('open');
    const positionBuilder = this.overlay.position();
    const strategy = positionBuilder.global().centerHorizontally().centerVertically();

    this.currentDialogRef = this.dialog.open<string>(ContainerCustom, {
      width: width,
      height: 'max-content',
      disableClose: true,
      positionStrategy: strategy,
      data: {
        content,
        modalData,
        dialogState: this.dialogState
      },
      closeOnNavigation: true
    });

    this.navSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeCustomModal();
        this.navSub?.unsubscribe();
        this.navSub = undefined;
      }
    });

    return this.currentDialogRef;
  }

  closeCustomModal(): void {
    this.navSub?.unsubscribe();
    this.navSub = undefined;
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined;
    }
    this.dialogState.set('closed');
  }
}
