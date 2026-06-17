import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgComponentOutlet } from '@angular/common';
import { Component, effect, inject, Injector, Type, WritableSignal } from '@angular/core';

@Component({
  selector: 'lib-container-custom, app-container-custom',
  imports: [NgComponentOutlet],
  templateUrl: './container-custom.html',
  styleUrl: './container-custom.css'
})
export class ContainerCustom {
  private readonly dialogData = inject(DIALOG_DATA);
  readonly content: Type<any> = this.dialogData.content;
  readonly dialogState: WritableSignal<'open' | 'closed'> = this.dialogData.dialogState;
  readonly injector:Injector;
  private readonly dialogRef = inject(DialogRef);

  constructor() {
    effect(() => {
      const state = this.dialogState();
      if (state === 'closed') {
        this.dialogRef.close();
      }
    });

    this.injector = Injector.create({
      providers: [
        { provide: DIALOG_DATA, useValue: this.dialogData.modalData }
      ]
    });
  }





}
