import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ConfirmModal, ConfirmModalData } from './confirm-modal';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface ConfirmModalOpenOptions {
  description?: string;
  showTopIcon?: boolean;
  topIconName?: string;
  variant?: ConfirmModalData['variant'];
  listItems?: ConfirmModalData['listItems'];
  height?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalStore {
  readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  protected dialogState: WritableSignal<'open' | 'closed'> = signal('open');
  private readonly router = inject(Router);
  private currentDialogRef?: DialogRef<string, unknown>;
  private navSub?: Subscription;

  open(
    title: string,
    labelButtonConfirm: string,
    reference = '',
    content = '',
    width = '19.5rem',
    labelButtonCancel = 'Cancelar',
    options: ConfirmModalOpenOptions = {}
  ): DialogRef<string, unknown> {
    this.dialogState.set('open');
    const positionBuilder = this.overlay.position();
    const strategy = positionBuilder.global().centerHorizontally().centerVertically();

    this.currentDialogRef = this.dialog.open<string>(ConfirmModal, {
      width,
      height: options.height,
      disableClose: true,
      autoFocus: false,
      positionStrategy: strategy,
      panelClass: 'lib-confirm-modal-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      data: {
        title: title,
        reference: reference,
        content: content,
        description: options.description,
        showTopIcon: options.showTopIcon,
        topIconName: options.topIconName,
        variant: options.variant,
        listItems: options.listItems,
        labelButtonConfirm: labelButtonConfirm,
        labelButtonCancel: labelButtonCancel,
      },
      closeOnNavigation: true
    });
    this.navSub?.unsubscribe();
    this.navSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.close();
        this.navSub?.unsubscribe();
        this.navSub = undefined;
      }
    });
    return this.currentDialogRef;
  }

  openBasic(title: string, confirmLabel: string, cancelLabel = 'Cancelar'): DialogRef<string, unknown> {
    return this.open(title, confirmLabel, '', '', '19.5rem', cancelLabel);
  }

  openWithDescription(
    title: string,
    description: string,
    confirmLabel: string,
    cancelLabel = 'Cancelar'
  ): DialogRef<string, unknown> {
    return this.open(title, confirmLabel, '', '', '19.5rem', cancelLabel, {
      description,
    });
  }

  openWithIcon(
    title: string,
    description: string,
    confirmLabel: string,
    cancelLabel = 'Cancelar',
    topIconName = 'check_box'
  ): DialogRef<string, unknown> {
    return this.open(title, confirmLabel, '', '', '19.5rem', cancelLabel, {
      description,
      showTopIcon: true,
      topIconName,
    });
  }

  openWithList(
    title: string,
    description: string,
    listItems: ConfirmModalData['listItems'],
    confirmLabel: string,
    cancelLabel = 'Cancelar',
    showTopIcon = false
  ): DialogRef<string, unknown> {
    return this.open(title, confirmLabel, '', '', '19.5rem', cancelLabel, {
      description,
      showTopIcon,
      variant: 'list',
      listItems,
    });
  }

  openWithScrollableList(
    title: string,
    description: string,
    listItems: ConfirmModalData['listItems'],
    confirmLabel: string,
    cancelLabel = 'Cancelar',
    showTopIcon = false
  ): DialogRef<string, unknown> {
    return this.open(title, confirmLabel, '', '', '19.5rem', cancelLabel, {
      description,
      showTopIcon,
      variant: 'scrollable-list',
      listItems,
      height: 'auto',
    });
  }

  close(): void {
    this.navSub?.unsubscribe();
    this.navSub = undefined;
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
      this.currentDialogRef = undefined;
    }
    this.dialogState.set('closed');
  }
}
