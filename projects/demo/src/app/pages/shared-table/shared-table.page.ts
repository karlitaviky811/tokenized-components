import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ConfirmModalStore,
  LibButtonComponent,
  LibCheckboxComponent,
  LibIconButtonComponent,
  LibListComponent,
  LibListItemData,
  SharedTableCellTemplateDirective,
  SharedTableComponent,
  SideModalStore,
} from 'crdx-components';
import type { SharedTableColumn } from 'crdx-components';

import { DemoUser, SelectedUserStore, UserDetailPanel } from './user-detail.panel';

const BASE_USERS: readonly DemoUser[] = [
  { id: 'u1', name: 'Ana García',     email: 'ana@credix.co',    role: 'Admin',    status: 'Activo',   amount: '1.250.000' },
  { id: 'u2', name: 'Carlos López',   email: 'carlos@credix.co', role: 'Operador', status: 'Activo',   amount: '480.000'   },
  { id: 'u3', name: 'María Ruiz',     email: 'maria@credix.co',  role: 'Viewer',   status: 'Inactivo', amount: '95.000'    },
  { id: 'u4', name: 'Pedro Martínez', email: 'pedro@credix.co',  role: 'Operador', status: 'Activo',   amount: '2.100.000' },
  { id: 'u5', name: 'Laura Díaz',     email: 'laura@credix.co',  role: 'Admin',    status: 'Activo',   amount: '760.000'   },
];

@Component({
  selector: 'app-shared-table-page',
  standalone: true,
  imports: [
    SharedTableComponent,
    SharedTableCellTemplateDirective,
    LibButtonComponent,
    LibIconButtonComponent,
    LibCheckboxComponent,
    LibListComponent,
  ],
  templateUrl: './shared-table.page.html',
  styleUrl: './shared-table.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTablePage {
  @ViewChild('batchTemplate', { static: true }) private batchTemplate!: TemplateRef<unknown>;

  private readonly confirmModal = inject(ConfirmModalStore);
  private readonly sideModal = inject(SideModalStore);
  private readonly selectedUser = inject(SelectedUserStore);

  /** Última acción resuelta, para dar feedback visible en la demo. */
  readonly lastAction = signal<string | null>(null);

  readonly batchItems = signal<LibListItemData[]>([]);

  // ── Tabla base (sin modal) ──────────────────────────────────────────────────

  readonly columns: SharedTableColumn<DemoUser>[] = [
    { key: 'name',   header: 'Nombre', width: '180px'  },
    { key: 'email',  header: 'Correo', width: '230px'  },
    { key: 'role',   header: 'Rol'                     },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  readonly data: readonly DemoUser[] = BASE_USERS;

  // ── 1. Row click → confirmación ─────────────────────────────────────────────

  onRowClickConfirm(row: DemoUser): void {
    this.confirmModal
      .openWithDescription(
        'Abrir ficha de ' + row.name,
        'Rol ' + row.role + ' · ' + row.email,
        'Abrir',
        'Cancelar',
      )
      .closed.subscribe((confirmed) => {
        this.lastAction.set(confirmed ? 'Ficha abierta: ' + row.name : 'Apertura cancelada');
      });
  }

  // ── 2. Acción por fila → confirmación destructiva ────────────────────────────

  readonly deletableUsers = signal<DemoUser[]>([...BASE_USERS]);

  readonly deletableColumns: SharedTableColumn<DemoUser>[] = [
    { key: 'name',    header: 'Nombre', width: '180px'               },
    { key: 'role',    header: 'Rol'                                  },
    { key: 'actions', header: '',       align: 'end', width: '72px'   },
  ];

  onDeleteRow(row: DemoUser): void {
    this.confirmModal
      .openWithIcon(
        '¿Eliminar a ' + row.name + '?',
        'Esta acción no se puede deshacer.',
        'Eliminar',
        'Cancelar',
        'delete',
      )
      .closed.subscribe((confirmed) => {
        if (!confirmed) {
          this.lastAction.set('Eliminación cancelada: ' + row.name);
          return;
        }
        this.deletableUsers.update((users) => users.filter((user) => user.id !== row.id));
        this.lastAction.set('Eliminado: ' + row.name);
      });
  }

  restoreDeletable(): void {
    this.deletableUsers.set([...BASE_USERS]);
    this.lastAction.set('Listado restaurado');
  }

  // ── 3. Selección múltiple → confirmación con lista ───────────────────────────

  readonly selectedIds = signal<readonly string[]>([]);

  readonly selectableColumns: SharedTableColumn<DemoUser>[] = [
    { key: 'select', header: '',       align: 'center', width: '56px' },
    { key: 'name',   header: 'Nombre', width: '180px'                 },
    { key: 'amount', header: 'Monto',  align: 'end'                   },
  ];

  readonly selectedCount = computed(() => this.selectedIds().length);

  isSelected(row: DemoUser): boolean {
    return this.selectedIds().includes(row.id);
  }

  toggleSelection(row: DemoUser, checked: boolean): void {
    this.selectedIds.update((ids) =>
      checked ? [...new Set([...ids, row.id])] : ids.filter((id) => id !== row.id),
    );
  }

  confirmSelection(): void {
    const selected = BASE_USERS.filter((user) => this.selectedIds().includes(user.id));

    this.batchItems.set(selected.map((user) => ({
      id: user.id,
      label: user.name,
      description: user.email,
    })));

    this.confirmModal
      .open(
        'Confirmar desembolso',
        'Procesar',
        '',
        'Se procesarán ' + selected.length + ' registros.',
        '19.5rem',
        'Cancelar',
        { bodyTemplate: this.batchTemplate },
      )
      .closed.subscribe((confirmed) => {
        if (!confirmed) {
          this.lastAction.set('Desembolso cancelado');
          return;
        }
        this.lastAction.set('Desembolso procesado: ' + selected.length + ' registros');
        this.selectedIds.set([]);
      });
  }

  // ── 4. Row click → panel lateral de detalle ──────────────────────────────────

  onRowClickPanel(row: DemoUser): void {
    this.selectedUser.select(row);
    this.sideModal.openSideModal(UserDetailPanel, 'Detalle · ' + row.name, '22rem');
  }
}
