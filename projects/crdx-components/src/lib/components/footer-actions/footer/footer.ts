import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ConfirmModalStore } from '../../dialogs/confirm-modal/confirm-modal.store';
import { LibButtonComponent } from '../../button/button';
import { ModalFooterActionsComponent } from '../modal-footer-actions/modal-footer-actions';
import { SideModalStore } from '../../dialogs/side-modal/side-modal.store';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterFlowStore } from './footer-flow.store';

@Component({
  selector: 'lib-side-modal-footer',
  standalone: true,
  imports: [ModalFooterActionsComponent, LibButtonComponent, TranslatePipe],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly sideModalStore = inject(SideModalStore);
  private readonly confirmModalStore = inject(ConfirmModalStore);
  private readonly flowStore = inject(FooterFlowStore);

  readonly primaryLabel = computed(() =>
    this.flowStore.currentStep() < this.flowStore.totalSteps() ? 'NEXT' : 'SAVE'
  );

  onCancel(): void {
    this.sideModalStore.closeSideModal();
  }

  onContinue(): void {
    if (this.flowStore.currentStep() < this.flowStore.totalSteps()) {
      this.flowStore.advance();
      return;
    }

    const dialogRef = this.confirmModalStore.open(
      '¿Guardar cambios?',
      'Guardar',
      '',
      '',
      'max-content',
      'Cancelar',
    );

    dialogRef.closed.subscribe((result: unknown) => {
      if (result === true) {
        this.sideModalStore.closeSideModal({ step: this.flowStore.totalSteps(), saved: true });
      }
    });
  }
}
