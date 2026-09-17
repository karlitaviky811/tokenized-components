import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Type, WritableSignal } from '@angular/core';

@Component({
  selector: 'lib-bottom-sheet',
  imports: [NgComponentOutlet],
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sheetAnimation', [
      state('closed', style({ transform: 'translateY(100%)' })),
      state('open', style({ transform: 'translateY(0)' })),
      transition('open => closed', [animate('0.3s ease')]),
    ]),
  ],
})
export class BottomSheet {
  private readonly dialogData = inject(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);

  readonly content: Type<unknown> = this.dialogData.content;
  readonly showDragHandle: boolean = this.dialogData.showDragHandle ?? true;
  readonly dialogState: WritableSignal<'open' | 'closed'> = this.dialogData.dialogState;

  close(): void {
    this.dialogState.set('closed');
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'closed') {
      this.dialogRef.close();
    }
  }
}
