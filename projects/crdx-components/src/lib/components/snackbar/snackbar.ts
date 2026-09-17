import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

/** Configuración de contenido del snackbar (Figma "Snackbar"). */
export type LibSnackbarConfiguration = 'text' | 'text-action' | 'text-longer-action';

export interface LibSnackbarData {
  /** Texto de soporte del snackbar. */
  message: string;
  /** Etiqueta de la acción. Si se define, se muestra el botón de acción. */
  actionLabel?: string;
  /** Muestra el botón de cierre (close affordance). */
  showClose?: boolean;
  /** Fuerza el layout de "longer action" (acción debajo del texto). */
  longerAction?: boolean;
}

@Component({
  selector: 'lib-snackbar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSnackbarComponent {
  private readonly ref = inject<MatSnackBarRef<LibSnackbarComponent>>(MatSnackBarRef);
  readonly data = inject<LibSnackbarData>(MAT_SNACK_BAR_DATA);

  get hasAction(): boolean { return !!this.data.actionLabel; }
  get showClose(): boolean { return !!this.data.showClose; }
  get longerAction(): boolean { return !!this.data.longerAction; }

  onAction(): void {
    this.ref.dismissWithAction();
  }

  onClose(): void {
    this.ref.dismiss();
  }
}
