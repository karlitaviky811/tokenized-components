import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { inject, Injectable, signal, Type, WritableSignal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SideModal } from './side-modal';

export interface SideModalHeaderConfig {
  showBackButton?: () => boolean;
  onBack?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class SideModalStore {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly dialogState: WritableSignal<'open' | 'closed' | 'action'> = signal('open');
  private currentDialogRef?: DialogRef<unknown, unknown>;
  private readonly router = inject(Router);

  openSideModal(
    content: Type<unknown>,
    title: string,
    width: string,
    footer?: Type<unknown>,
    headerConfig?: SideModalHeaderConfig
  ): DialogRef<unknown, unknown> {
    this.dialogState.set('open');
    const positionBuilder = this.overlay.position();
    const strategy = positionBuilder.global().end();

    this.currentDialogRef = this.dialog.open<unknown>(SideModal, {
      width: width,
      height: '100%',
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'lib-side-modal-backdrop',
      positionStrategy: strategy,
      data: {
        title: title,
        content,
        dialogState: this.dialogState,
        footer,
        headerConfig,
      },
      closeOnNavigation: true
    });

    const sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.closeSideModal();
        sub.unsubscribe();
      }
    });

    return this.currentDialogRef;
  }

  isOnAction(): boolean {
    return this.dialogState() === 'action';
  }

  closeSideModal(_data?: unknown): void {
    void _data;
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined;
    }
    this.dialogState.set('closed');
  }

  actionSideModal(): void {
    this.dialogState.set('action');
  }


}
