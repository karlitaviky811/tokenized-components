import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LibSnackbarStore } from 'crdx-components';
import { LibButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-snackbar-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './snackbar.page.html',
  styleUrl: './snackbar.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarPage {
  private readonly snackbar = inject(LibSnackbarStore);

  openTextOnly(): void {
    this.snackbar.open('Mensaje guardado correctamente.');
  }

  openWithAction(): void {
    const ref = this.snackbar.openWithAction('Elemento eliminado.', 'Deshacer');
    ref.onAction().subscribe(() => console.log('Deshacer acción ejecutada'));
  }

  openWithClose(): void {
    this.snackbar.open('Actualización disponible.', { showClose: true });
  }

  openWithActionAndClose(): void {
    this.snackbar.openWithAction('Archivo subido.', 'Ver', { showClose: true });
  }

  openLongerAction(): void {
    this.snackbar.openWithAction(
      'No se pudo conectar al servidor.',
      'Reintentar conexión',
      { longerAction: true },
    );
  }

  openLongerActionAndClose(): void {
    this.snackbar.openWithAction(
      'No se pudo enviar el mensaje.',
      'Reintentar envío',
      { longerAction: true, showClose: true },
    );
  }

  openMultiLine(): void {
    this.snackbar.open(
      'La operación no pudo completarse.\nRevisa tu conexión e intenta de nuevo.',
      { showClose: true },
    );
  }

  openNoDismiss(): void {
    this.snackbar.open('Procesando... por favor espera.', {
      duration: 0,
      showClose: true,
    });
  }

  openLongDuration(): void {
    this.snackbar.open('Este mensaje dura 8 segundos.', { duration: 8000 });
  }
}
