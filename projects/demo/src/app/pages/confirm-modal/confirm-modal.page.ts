import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  ConfirmModal,
  DynamicDialog,
  DynamicDialogData,
  LibButtonComponent,
  LibListComponent,
  LibListItemData,
  LibSelectFieldComponent,
  LibSelectOption,
  LibTextFieldComponent,
} from 'crdx-components';

@Component({
  selector: 'app-confirm-modal-page',
  standalone: true,
  imports: [LibButtonComponent, LibSelectFieldComponent, LibTextFieldComponent, LibListComponent],
  templateUrl: './confirm-modal.page.html',
  styleUrl: './confirm-modal.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalPage {
  // ── ConfirmModal body templates (examples 1–2) ──────────────────────────
  @ViewChild('listBody', { static: true }) listBodyTemplate!: TemplateRef<unknown>;

  // ── DynamicDialog section templates (examples 3–5) ──────────────────────
  @ViewChild('scrollableListHeader', { static: true }) scrollableListHeaderTemplate!: TemplateRef<unknown>;
  @ViewChild('scrollableListBody',   { static: true }) scrollableListBodyTemplate!: TemplateRef<unknown>;
  @ViewChild('scrollableListActions',{ static: true }) scrollableListActionsTemplate!: TemplateRef<unknown>;

  @ViewChild('documentHeader',  { static: true }) documentHeaderTemplate!: TemplateRef<unknown>;
  @ViewChild('documentBody',    { static: true }) documentBodyTemplate!: TemplateRef<unknown>;
  @ViewChild('documentActions', { static: true }) documentActionsTemplate!: TemplateRef<unknown>;

  @ViewChild('addressHeader',  { static: true }) addressHeaderTemplate!: TemplateRef<unknown>;
  @ViewChild('addressBody',    { static: true }) addressBodyTemplate!: TemplateRef<unknown>;
  @ViewChild('addressActions', { static: true }) addressActionsTemplate!: TemplateRef<unknown>;

  private readonly dialog  = inject(Dialog);
  private readonly overlay = inject(Overlay);

  // Dialog refs for DynamicDialog examples (needed to close from action templates)
  readonly scrollableDialogRef = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);
  readonly documentDialogRef   = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);
  readonly addressDialogRef    = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);

  readonly provincias: LibSelectOption[] = [
    { value: 'sj', label: 'San José' },
    { value: 'al', label: 'Alajuela' },
    { value: 'ca', label: 'Cartago' },
    { value: 'he', label: 'Heredia' },
  ];

  readonly cantones: LibSelectOption[] = [
    { value: 'sj', label: 'San José' },
    { value: 'es', label: 'Escazú' },
    { value: 'de', label: 'Desamparados' },
    { value: 'mo', label: 'Montes de Oca' },
  ];

  readonly distritos: LibSelectOption[] = [
    { value: 'ca', label: 'Carmen' },
    { value: 'me', label: 'Merced' },
    { value: 'ho', label: 'Hospital' },
    { value: 'ca2', label: 'Catedral' },
  ];

  readonly listItems = signal<LibListItemData[]>([
    { id: '1', avatarText: 'J', label: 'Juan Pérez',   description: 'Cuenta corriente' },
    { id: '2', avatarText: 'M', label: 'María López',  description: 'Cuenta de ahorros' },
    { id: '3', avatarText: 'C', label: 'Carlos Ruiz',  description: 'Cuenta corriente' },
  ]);

  readonly listSelectedIds = signal<string[]>(['1']);

  readonly scrollableListItems = signal<LibListItemData[]>([
    { id: '1', avatarText: 'J', label: 'Juan Pérez',   description: 'Cuenta corriente' },
    { id: '2', avatarText: 'M', label: 'María López',  description: 'Cuenta de ahorros' },
    { id: '3', avatarText: 'C', label: 'Carlos Ruiz',  description: 'Cuenta corriente' },
    { id: '4', avatarText: 'A', label: 'Ana González', description: 'Cuenta de ahorros' },
    { id: '5', avatarText: 'L', label: 'Luis Mora',    description: 'Cuenta corriente' },
  ]);

  readonly scrollableSelectedIds = signal<string[]>(['1', '4']);

  readonly documentItems = signal<LibListItemData[]>([
    { id: 'docs',   label: 'Abrir documentos' },
    { id: 'photos', label: 'Abrir fotos' },
    { id: 'scan',   label: 'Escanear documento' },
  ]);

  readonly documentIconMap = new Map([
    ['docs',   'add_notes'],
    ['photos', 'add_photo_alternate'],
    ['scan',   'document_scanner'],
  ]);

  private centeredPos() {
    return this.overlay.position().global().centerHorizontally().centerVertically();
  }

  // ── ConfirmModal examples ────────────────────────────────────────────────

  openBasicFilled(): void {
    this.dialog.open(ConfirmModal, {
      width: '19.5rem',
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-confirm-modal-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Actualizar su correo electrónico',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Actualizar',
        primaryFilled: true,
      },
    });
  }

  openListDialog(): void {
    this.dialog.open(ConfirmModal, {
      width: '19.5rem',
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-confirm-modal-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Dialog title',
        content: 'A dialog is a type of modal window that appears in front of app content to provide critical information or ask for a decision.',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Confirmar',
        bodyTemplate: this.listBodyTemplate,
      },
    });
  }

  // ── DynamicDialog examples ───────────────────────────────────────────────

  openScrollableListDialog(): void {
    const ref = this.dialog.open<unknown, DynamicDialogData, DynamicDialog>(DynamicDialog, {
      width: '17.5rem',
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-dynamic-dialog-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        headerTemplate: this.scrollableListHeaderTemplate,
        bodyTemplate: this.scrollableListBodyTemplate,
        actionsTemplate: this.scrollableListActionsTemplate,
      },
    });
    this.scrollableDialogRef.set(ref);
  }

  openDocumentDialog(): void {
    const ref = this.dialog.open<unknown, DynamicDialogData, DynamicDialog>(DynamicDialog, {
      width: '19.5rem',
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-dynamic-dialog-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        headerTemplate: this.documentHeaderTemplate,
        bodyTemplate: this.documentBodyTemplate,
        actionsTemplate: this.documentActionsTemplate,
      },
    });
    this.documentDialogRef.set(ref);
  }

  onDocumentItemClick(item: LibListItemData): void {
    this.documentDialogRef()?.close(item.id);
  }

  openAddressDialog(): void {
    const ref = this.dialog.open<unknown, DynamicDialogData, DynamicDialog>(DynamicDialog, {
      width: '19.5rem',
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-dynamic-dialog-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        headerTemplate: this.addressHeaderTemplate,
        bodyTemplate: this.addressBodyTemplate,
        actionsTemplate: this.addressActionsTemplate,
      },
    });
    this.addressDialogRef.set(ref);
  }
}
