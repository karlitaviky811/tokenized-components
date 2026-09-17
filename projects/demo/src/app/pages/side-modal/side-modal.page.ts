import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LibButtonComponent, SideModalStore } from 'crdx-components';

@Component({
  selector: 'app-side-modal-demo-content',
  standalone: true,
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.5;">
        Este es el contenido dinámico del Side Modal. Puede ser cualquier componente Angular,
        como un formulario de edición, un panel de detalle o un flujo de configuración.
      </p>
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.5;">
        El Side Modal se cierra con el botón X del header o haciendo click fuera del panel.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideModalDemoContent {}

@Component({
  selector: 'app-side-modal-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './side-modal.page.html',
  styleUrl: './side-modal.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideModalPage {
  private readonly sideModalStore = inject(SideModalStore);

  openSideModal(): void {
    this.sideModalStore.openSideModal(
      SideModalDemoContent,
      'Panel de ejemplo',
      '28rem'
    );
  }
}
