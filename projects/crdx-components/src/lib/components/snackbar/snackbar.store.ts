import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { LibSnackbarComponent, LibSnackbarData } from './snackbar';

export interface LibSnackbarOpenOptions {
  /** Etiqueta de acción. Si se define, muestra el botón de acción. */
  actionLabel?: string;
  /** Muestra el botón de cierre. */
  showClose?: boolean;
  /** Usa el layout "longer action" (acción debajo del texto). */
  longerAction?: boolean;
  /** Duración en ms antes del auto-dismiss. 0 = no se cierra solo. Default 4000. */
  duration?: number;
  /** Posición horizontal. Default 'center'. */
  horizontalPosition?: MatSnackBarConfig['horizontalPosition'];
  /** Posición vertical. Default 'bottom'. */
  verticalPosition?: MatSnackBarConfig['verticalPosition'];
}

/**
 * Servicio para mostrar snackbars. Envuelve MatSnackBar: gestiona overlay,
 * posición, auto-dismiss y cola. El panel visual es LibSnackbarComponent.
 */
@Injectable({ providedIn: 'root' })
export class LibSnackbarStore {
  private readonly snackBar = inject(MatSnackBar);

  /** Snackbar solo texto. */
  openText(message: string, options: LibSnackbarOpenOptions = {}): MatSnackBarRef<LibSnackbarComponent> {
    return this.open(message, options);
  }

  /** Snackbar con texto + acción. */
  openWithAction(
    message: string,
    actionLabel: string,
    options: LibSnackbarOpenOptions = {}
  ): MatSnackBarRef<LibSnackbarComponent> {
    return this.open(message, { ...options, actionLabel });
  }

  open(message: string, options: LibSnackbarOpenOptions = {}): MatSnackBarRef<LibSnackbarComponent> {
    const data: LibSnackbarData = {
      message,
      actionLabel: options.actionLabel,
      showClose: options.showClose,
      longerAction: options.longerAction,
    };

    return this.snackBar.openFromComponent(LibSnackbarComponent, {
      data,
      duration: options.duration ?? 4000,
      horizontalPosition: options.horizontalPosition ?? 'center',
      verticalPosition: options.verticalPosition ?? 'bottom',
      panelClass: 'lib-snackbar-panel',
    });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}
