import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgComponentOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal, Type, WritableSignal } from '@angular/core';
import { SideModalHeaderConfig } from './side-modal.store';


@Component({
  selector: 'lib-side-modal, app-side-modal',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './side-modal.html',
  styleUrl: './side-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideModal {
  readonly dialogData = inject(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);

  readonly content: Type<unknown> = this.dialogData.content;
  readonly title:string = this.dialogData.title;
  readonly footer: Type<unknown> | undefined = this.dialogData.footer;
  readonly headerConfig: SideModalHeaderConfig | undefined = this.dialogData.headerConfig;
  readonly dialogState:WritableSignal<'open' | 'closed'> = this.dialogData.dialogState;

  /** Posición de render: arranca fuera para que la entrada se anime al primer frame. */
  readonly rendered = signal(false);

  constructor() {
    afterNextRender(() => this.rendered.set(true));
  }

  closeDialog(): void {
    this.dialogState.set('closed');
  }

  shouldShowBack(): boolean {
    return this.headerConfig?.showBackButton?.() ?? false;
  }

  onBackClick(): void {
    this.headerConfig?.onBack?.();
  }

  onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'transform' && this.dialogState() === 'closed') {
      this.dialogRef.close(true);
    }
  }
}
