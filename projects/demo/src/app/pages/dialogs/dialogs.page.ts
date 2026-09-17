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
  LibButtonComponent,
  LibListComponent,
  LibListItemData,
  LibSelectFieldComponent,
  LibSelectOption,
  LibTextFieldComponent,
} from 'crdx-components';

@Component({
  selector: 'app-dialogs-page',
  standalone: true,
  imports: [LibButtonComponent, LibSelectFieldComponent, LibTextFieldComponent, LibListComponent],
  templateUrl: './dialogs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsPage {
  @ViewChild('addressBody', { static: true }) addressBodyTemplate!: TemplateRef<unknown>;
  @ViewChild('listBody', { static: true }) listBodyTemplate!: TemplateRef<unknown>;
  @ViewChild('documentBody', { static: true }) documentBodyTemplate!: TemplateRef<unknown>;

  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);

  private documentDialogRef?: DialogRef<unknown, ConfirmModal>;

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
    { id: '1', label: 'Usuario uno' },
    { id: '2', label: 'Usuario dos' },
    { id: '3', label: 'Usuario tres' },
  ]);

  readonly listSelectedIds = signal<string[]>(['1', '2']);

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

  openBasicFilled(): void {
    this.dialog.open(ConfirmModal, {
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

  openDocumentDialog(): void {
    this.documentDialogRef = this.dialog.open(ConfirmModal, {
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-confirm-modal-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Carga de documentos',
        description: 'Puede elegir archivos con un tamaño máximo de 3 GB.',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Subir archivo',
        primaryFilled: true,
        bodyTemplate: this.documentBodyTemplate,
      },
    });
  }

  onDocumentItemClick(item: LibListItemData): void {
    this.documentDialogRef?.close(item.id);
  }

  openAddressDialog(): void {
    this.dialog.open(ConfirmModal, {
      positionStrategy: this.centeredPos(),
      panelClass: 'lib-confirm-modal-panel',
      backdropClass: 'lib-confirm-modal-backdrop',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Domicilio',
        description: 'Verifique la ubicación para la entrega entre las 8:00 a.m. y 5:00 p.m.',
        showTopIcon: true,
        topIconName: 'home',
        labelButtonCancel: 'Cancelar',
        labelButtonConfirm: 'Confirmar',
        primaryFilled: true,
        bodyTemplate: this.addressBodyTemplate,
      },
    });
  }
}
