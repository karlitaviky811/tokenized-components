import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { inject, Injectable, signal, Type, WritableSignal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ContainerCustom } from './container-custom';

export interface ModalData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomModalState {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  readonly dialogState: WritableSignal<'open' | 'closed'> = signal('open');
  private currentDialogRef?: DialogRef<any>;
  private readonly router = inject(Router);

  constructor() { }

  openCustomModal(content: Type<any>, width: string, modalData?: {}): DialogRef<string, any> {
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
        dialogState: this.dialogState // Pasar el estado como dato en lugar de inyectar el servicio
      },
      closeOnNavigation: true
    });
    const sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeCustomModal();
        sub.unsubscribe();
      }
    });
    return this.currentDialogRef;
  }

  closeCustomModal(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined;
    }
    this.dialogState.set('closed');
  }

}
