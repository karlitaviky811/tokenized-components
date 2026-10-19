import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgComponentOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal, Type, WritableSignal } from '@angular/core';

@Component({
  selector: 'lib-bottom-sheet',
  imports: [NgComponentOutlet],
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheet {
  private readonly dialogData = inject(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);

  readonly content: Type<unknown> = this.dialogData.content;
  readonly showDragHandle: boolean = this.dialogData.showDragHandle ?? true;
  readonly dialogState: WritableSignal<'open' | 'closed'> = this.dialogData.dialogState;

  /** Posición de render: arranca fuera para que la entrada se anime al primer frame. */
  readonly rendered = signal(false);

  constructor() {
    afterNextRender(() => this.rendered.set(true));
  }

  close(): void {
    this.dialogState.set('closed');
  }

  onTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'transform' && this.dialogState() === 'closed') {
      this.dialogRef.close();
    }
  }
}
