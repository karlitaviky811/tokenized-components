import { inject, Injectable, signal } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { DynamicDialog, DynamicDialogData } from './dynamic-dialog';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface DynamicDialogOpenOptions {
  width?: string;
  height?: string;
}

@Injectable({ providedIn: 'root' })
export class DynamicDialogStore {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly dialogState = signal<'open' | 'closed'>('closed');
  private readonly router = inject(Router);
  private currentDialogRef?: DialogRef<unknown, DynamicDialog>;
  private navSub?: Subscription;

  open(data: DynamicDialogData, options: DynamicDialogOpenOptions = {}): DialogRef<unknown, DynamicDialog> {
    this.dialogState.set('open');
    const strategy = this.overlay.position().global().centerHorizontally().centerVertically();

    this.currentDialogRef = this.dialog.open<unknown, DynamicDialogData, DynamicDialog>(DynamicDialog, {
      width: options.width ?? '19.5rem',
      height: options.height,
      disableClose: true,
      autoFocus: false,
      positionStrategy: strategy,
      panelClass: 'lib-dynamic-dialog-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      data,
      closeOnNavigation: true,
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
