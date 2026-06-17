import { Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { LibButtonComponent, ConfirmModal } from 'crdx-components';

@Component({
  selector: 'app-dialogs-page',
  standalone: true,
  imports: [LibButtonComponent],
  template: `
    <article class="doc-page">
      <!-- CONFIRM MODAL -->
      <section class="doc-section">
        <h2>ConfirmModal <code>lib-confirm</code></h2>
        <p>Modal de confirmación abierto via CDK Dialog. Soporta variantes: basic, list, scrollable-list.</p>

        <h3>ConfirmModalData (config)</h3>
        <table class="api-table">
          <tr><th>Propiedad</th><th>Tipo</th><th>Descripción</th></tr>
          <tr><td>title</td><td>string</td><td>Título del modal</td></tr>
          <tr><td>content</td><td>string</td><td>Texto del cuerpo</td></tr>
          <tr><td>description</td><td>string</td><td>Descripción adicional</td></tr>
          <tr><td>variant</td><td>'basic' | 'list' | 'scrollable-list'</td><td>Variante visual</td></tr>
          <tr><td>showTopIcon</td><td>boolean</td><td>Muestra ícono superior</td></tr>
          <tr><td>topIconName</td><td>string</td><td>Nombre del ícono superior</td></tr>
          <tr><td>listItems</td><td>ConfirmModalListItem[]</td><td>Items para variantes list</td></tr>
          <tr><td>labelButtonCancel</td><td>string</td><td>Label del botón cancelar</td></tr>
          <tr><td>labelButtonConfirm</td><td>string</td><td>Label del botón confirmar</td></tr>
        </table>

        <h3>Demo</h3>
        <div class="variant-row">
          <lib-button label="Abrir Confirm Modal" variant="outlined" shape="square" size="medium" [fullWidth]="false" (click)="openConfirm()" />
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>const dialogRef = this.dialog.open(ConfirmModal, {{ '{' }}
  data: {{ '{' }}
    title: '¿Eliminar registro?',
    content: 'Esta acción no se puede deshacer.',
    labelButtonCancel: 'Cancelar',
    labelButtonConfirm: 'Eliminar',
  {{ '}' }},
{{ '}' }});

dialogRef.closed.subscribe(result => {{ '{' }}
  if (result) {{ '{' }} /* confirmado */ {{ '}' }}
{{ '}' }});</code></pre>
      </section>

      <!-- SIDE MODAL -->
      <section class="doc-section">
        <h2>SideModal <code>lib-side-modal</code></h2>
        <p>Modal lateral que se desliza desde la derecha. Recibe un componente dinámico como contenido.</p>

        <h3>SideModal Data (config)</h3>
        <table class="api-table">
          <tr><th>Propiedad</th><th>Tipo</th><th>Descripción</th></tr>
          <tr><td>content</td><td>Type&lt;any&gt;</td><td>Componente a renderizar</td></tr>
          <tr><td>title</td><td>string</td><td>Título del modal</td></tr>
          <tr><td>footer</td><td>Type&lt;any&gt; | undefined</td><td>Componente footer (opcional)</td></tr>
          <tr><td>headerConfig</td><td>SideModalHeaderConfig</td><td>Configuración del header</td></tr>
          <tr><td>dialogState</td><td>WritableSignal&lt;'open' | 'closed'&gt;</td><td>Controla la animación</td></tr>
        </table>

        <h3>Ejemplo de uso</h3>
        <pre><code>const state = signal&lt;'open' | 'closed'&gt;('open');

this.dialog.open(SideModal, {{ '{' }}
  data: {{ '{' }}
    content: MyDetailComponent,
    title: 'Detalle',
    dialogState: state,
  {{ '}' }},
  panelClass: 'side-modal-panel',
{{ '}' }});</code></pre>
      </section>
    </article>
  `,
})
export class DialogsPage {
  private readonly dialog = inject(Dialog);

  openConfirm(): void {
    this.dialog.open(ConfirmModal, {
      data: {
        title: '¿Confirmar acción?',
        content: 'Esto es una demostración del modal de confirmación.',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Confirmar',
      },
    });
  }
}
