import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';

/**
 * Fila de la tabla de demo.
 *
 * El index signature es obligatorio: `SharedTableColumn<T>` restringe
 * `T extends Record<string, unknown>`.
 */
export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  amount: string;
  [key: string]: unknown;
};

/**
 * `SideModalStore.openSideModal()` renderiza el contenido con `NgComponentOutlet`,
 * que NO permite pasar inputs al componente proyectado.
 *
 * El patrón correcto es compartir el dato por un store inyectable: la tabla
 * escribe la fila seleccionada aquí y el panel la lee.
 */
@Injectable({ providedIn: 'root' })
export class SelectedUserStore {
  private readonly _user = signal<DemoUser | null>(null);

  readonly user = this._user.asReadonly();

  select(user: DemoUser | null): void {
    this._user.set(user);
  }
}

@Component({
  selector: 'app-user-detail-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (user(); as detail) {
      <dl class="user-detail">
        <dt class="user-detail__label">Nombre</dt>
        <dd class="user-detail__value">{{ detail.name }}</dd>

        <dt class="user-detail__label">Correo</dt>
        <dd class="user-detail__value">{{ detail.email }}</dd>

        <dt class="user-detail__label">Rol</dt>
        <dd class="user-detail__value">{{ detail.role }}</dd>

        <dt class="user-detail__label">Estado</dt>
        <dd class="user-detail__value">{{ detail.status }}</dd>

        <dt class="user-detail__label">Cupo</dt>
        <dd class="user-detail__value">{{ detail.amount }}</dd>
      </dl>
    } @else {
      <p class="user-detail__empty">Sin fila seleccionada.</p>
    }
  `,
  styles: `
    .user-detail {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1rem;
      margin: 0;
      padding: 1rem;
      font-family: 'Heebo', sans-serif;
      font-size: 0.875rem;
    }

    .user-detail__label {
      font-weight: 600;
      color: #5b5f61;
    }

    .user-detail__value {
      margin: 0;
      color: #181c1e;
    }

    .user-detail__empty {
      padding: 1rem;
      color: #5b5f61;
    }
  `,
})
export class UserDetailPanel {
  protected readonly user = inject(SelectedUserStore).user;
}
