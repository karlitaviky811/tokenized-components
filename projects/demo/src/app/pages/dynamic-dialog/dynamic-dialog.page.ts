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
  DynamicDialog,
  DynamicDialogStore,
  LibButtonComponent,
  LibListComponent,
  LibListItemData,
  LibSelectFieldComponent,
  LibSelectOption,
  LibSuggestionChipComponent,
  LibTextFieldComponent,
} from 'crdx-components';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dynamic-dialog-page',
  standalone: true,
  imports: [LibButtonComponent, LibSelectFieldComponent, LibTextFieldComponent, LibListComponent, LibSuggestionChipComponent],
  templateUrl: './dynamic-dialog.page.html',
  styleUrl: './dynamic-dialog.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDialogPage {
  @ViewChild('addressHeader', { static: true }) addressHeader!: TemplateRef<unknown>;
  @ViewChild('addressBody', { static: true }) addressBody!: TemplateRef<unknown>;
  @ViewChild('addressActions', { static: true }) addressActions!: TemplateRef<unknown>;

  @ViewChild('documentHeader', { static: true }) documentHeader!: TemplateRef<unknown>;
  @ViewChild('documentBody', { static: true }) documentBody!: TemplateRef<unknown>;
  @ViewChild('documentActions', { static: true }) documentActions!: TemplateRef<unknown>;

  @ViewChild('listHeader', { static: true }) listHeader!: TemplateRef<unknown>;
  @ViewChild('listBody', { static: true }) listBody!: TemplateRef<unknown>;
  @ViewChild('listActions', { static: true }) listActions!: TemplateRef<unknown>;

  @ViewChild('idHeader',  { static: true }) idHeader!: TemplateRef<unknown>;
  @ViewChild('idBody',    { static: true }) idBody!: TemplateRef<unknown>;
  @ViewChild('idActions', { static: true }) idActions!: TemplateRef<unknown>;

  private readonly store = inject(DynamicDialogStore);

  readonly addressDialogRef  = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);
  readonly documentDialogRef = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);
  readonly listDialogRef     = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);
  readonly idDialogRef       = signal<DialogRef<unknown, DynamicDialog> | undefined>(undefined);

  // ── Estado del dialog de identificación ─────────────────────────────────
  readonly idType   = signal<'nacional' | 'dimex'>('nacional');
  readonly idNumber = signal('');
  readonly idFieldLabel = computed(() =>
    this.idType() === 'nacional' ? 'Número de identificación' : 'Número de DIMEX'
  );

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

  readonly listItems = signal<LibListItemData[]>([
    { id: '1', avatarText: 'J', label: 'Juan Pérez',   description: 'Cuenta corriente' },
    { id: '2', avatarText: 'M', label: 'María López',  description: 'Cuenta de ahorros' },
    { id: '3', avatarText: 'C', label: 'Carlos Ruiz',  description: 'Cuenta corriente' },
  ]);

  readonly listSelectedIds = signal<string[]>(['1']);

  openAddressDialog(): void {
    const ref = this.store.open({
      headerTemplate: this.addressHeader,
      bodyTemplate: this.addressBody,
      actionsTemplate: this.addressActions,
    }, { width: '19.5rem' });
    this.addressDialogRef.set(ref);
  }

  openDocumentDialog(): void {
    const ref = this.store.open({
      headerTemplate: this.documentHeader,
      bodyTemplate: this.documentBody,
      actionsTemplate: this.documentActions,
    }, { width: '19.5rem' });
    this.documentDialogRef.set(ref);
  }

  openListDialog(): void {
    const ref = this.store.open({
      headerTemplate: this.listHeader,
      bodyTemplate: this.listBody,
      actionsTemplate: this.listActions,
    }, { width: '19.5rem' });
    this.listDialogRef.set(ref);
  }

  onDocumentItemClick(item: LibListItemData): void {
    this.documentDialogRef()?.close(item.id);
  }

  openIdDialog(): void {
    this.idType.set('nacional');
    this.idNumber.set('');
    const ref = this.store.open({
      headerTemplate: this.idHeader,
      bodyTemplate:   this.idBody,
      actionsTemplate: this.idActions,
    }, { width: '19.5rem' });
    this.idDialogRef.set(ref);
  }

  selectIdType(type: 'nacional' | 'dimex'): void {
    this.idType.set(type);
    this.idNumber.set('');
  }
}
