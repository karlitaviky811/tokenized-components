import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LibButtonComponent, BottomSheetStore } from 'crdx-components';

@Component({
  selector: 'app-bottom-sheet-demo-content',
  standalone: true,
  template: `
    <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.5; color: inherit;">
        Este es el contenido dinámico del Bottom Sheet. Puede recibir cualquier componente Angular:
        un formulario, un listado de opciones, un panel de filtros, etc.
      </p>
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.5; color: inherit;">
        El sheet se cierra tocando el backdrop o programáticamente desde el store.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetDemoContent {}

@Component({
  selector: 'app-bottom-sheet-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './bottom-sheet.page.html',
  styleUrl: './bottom-sheet.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetPage {
  private readonly sheetStore = inject(BottomSheetStore);

  openDefault(): void {
    this.sheetStore.open(BottomSheetDemoContent);
  }

  openNoDragHandle(): void {
    this.sheetStore.open(BottomSheetDemoContent, { showDragHandle: false });
  }
}
