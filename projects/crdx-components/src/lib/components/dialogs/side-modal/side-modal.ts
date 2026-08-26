import { animate, state, style, transition, trigger,AnimationEvent } from '@angular/animations';
import { DialogRef,DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Type, WritableSignal } from '@angular/core';
import { SideModalHeaderConfig } from './side-modal.state';


@Component({
  selector: 'lib-side-modal, app-side-modal',
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './side-modal.html',
  styleUrl: './side-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dialogAnimation',[
      state('closed', style({ transform: 'translateX(100%)' })),
      state('open', style({ transform: 'translateX(0)'})),
      transition('open => closed', [animate('0.5s ease')]),
    ])
  ]
})
export class SideModal {
  readonly dialogData = inject(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);

  readonly content: Type<any> = this.dialogData.content;
  readonly title:string = this.dialogData.title;
  readonly footer: Type<any> | undefined = this.dialogData.footer;
  readonly headerConfig: SideModalHeaderConfig | undefined = this.dialogData.headerConfig;
  readonly dialogState:WritableSignal<'open' | 'closed'> = this.dialogData.dialogState;

  closeDialog(): void {
    this.dialogState.set('closed');
  }

  shouldShowBack(): boolean {
    return this.headerConfig?.showBackButton?.() ?? false;
  }

  onBackClick(): void {
    this.headerConfig?.onBack?.();
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'action' || event.toState === 'closed') {
      this.dialogRef.close(true);
    }
  }


}
