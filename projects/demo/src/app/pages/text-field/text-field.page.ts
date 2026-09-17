import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { disabled, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { LibSuggestionChipComponent, LibTextFieldComponent } from 'crdx-components';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const INFO_ERROR_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17C12.2833 17 12.5208 16.9042 12.7125 16.7125C12.9042 16.5208 13 16.2833 13 16C13 15.7167 12.9042 15.4792 12.7125 15.2875C12.5208 15.0958 12.2833 15 12 15C11.7167 15 11.4792 15.0958 11.2875 15.2875C11.0958 15.4792 11 15.7167 11 16C11 16.2833 11.0958 16.5208 11.2875 16.7125C11.4792 16.9042 11.7167 17 12 17ZM11 13H13V7H11V13ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z" fill="#FF4965"/></svg>`;

export interface IdType {
  label: string;
  mask: string;
  dataLength: number;
  placeholder: string;
}

const ID_TYPES: IdType[] = [
  { label: 'Cédula nacional', mask: '#-####-####',  dataLength: 9,  placeholder: '1-2345-6789'   },
  { label: 'DIMEX',           mask: '############', dataLength: 12, placeholder: '123456789012'  },
  { label: 'NITE',            mask: '#-###-######', dataLength: 10, placeholder: '3-101-123456'  },
];

@Component({
  selector: 'app-text-field-page',
  standalone: true,
  imports: [FormField, LibTextFieldComponent, LibSuggestionChipComponent],
  templateUrl: './text-field.page.html',
  styleUrl: './text-field.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldPage {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  // ── Demo: Error con ícono ─────────────────────────────────────────────────
  readonly accountValue = signal('');
  readonly accountError = signal<string | null>(null);

  onAccountValueChange(value: string): void {
    this.accountValue.set(value);
    this.accountError.set(null);
  }

  onAccountBlur(): void {
    const val = this.accountValue().replace(/-/g, '').trim();
    if (val.length > 0 && val.length < 8) {
      this.accountError.set('El número de cuenta no existe');
    }
  }

  // ── Demo: Carga de datos ──────────────────────────────────────────────────
  readonly searchValue = signal('');
  readonly isLoading = signal(false);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  onSearchChange(value: string): void {
    this.searchValue.set(value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (!value.trim()) {
      this.isLoading.set(false);
      return;
    }
    this.isLoading.set(true);
    this.searchTimer = setTimeout(() => this.isLoading.set(false), 1500);
  }

  constructor() {
    this.iconRegistry.addSvgIconLiteral('info-error', this.sanitizer.bypassSecurityTrustHtml(INFO_ERROR_SVG));
  }

  // ── Variantes base ────────────────────────────────────────────────────────
  readonly model = signal({ name: '', email: '', error: '', hint: '', disabled: '' });
  readonly f = form(this.model, (p) => {
    disabled(p.disabled);
    required(p.error, { message: 'Campo requerido' });
  });

  // ── Demo: Identificación con parametrización dinámica ─────────────────────
  readonly idTypes = ID_TYPES;
  readonly selectedIdIndex = signal(0);
  readonly currentIdType = computed(() => this.idTypes[this.selectedIdIndex()]);

  readonly idDocValue = signal('');
  readonly idDocError = signal<string | null>(null);

  // Último ID que superó la validación de longitud exacta.
  // Permite detectar cambio de identidad y limpiar los campos de contacto.
  private readonly lastValidId = signal('');

  readonly isIdComplete = computed(
    () => this.idDocValue().length === this.currentIdType().dataLength
  );

  // Campos de contacto — persisten en el modelo aunque estén ocultos.
  // Si el usuario vuelve a ingresar el mismo ID, los valores reaparecen.
  readonly contactModel = signal({ celular: '', correo: '' });
  readonly cf = form(this.contactModel, (p) => {
    required(p.correo, { message: 'El correo es requerido' });
    minLength(p.correo, 6, { message: 'Mínimo 6 caracteres' });
    pattern(p.correo, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, { message: 'Formato de correo inválido' });
  });

  selectIdType(index: number): void {
    this.selectedIdIndex.set(index);
    this.idDocValue.set('');
    this.idDocError.set(null);
  }

  onIdValueChange(value: string): void {
    this.idDocValue.set(value);
    this.idDocError.set(null); // error se limpia inmediatamente al editar

    if (value.length === this.currentIdType().dataLength && value !== this.lastValidId()) {
      // Identidad distinta → limpiar campos de contacto
      this.lastValidId.set(value);
      this.contactModel.set({ celular: '', correo: '' });
    }
  }

  onIdBlur(): void {
    const len = this.idDocValue().length;
    const required = this.currentIdType().dataLength;
    if (len > 0 && len < required) {
      this.idDocError.set(`Longitud requerida: ${required} caracteres`);
    }
  }

  // ── Demo: Otros formatos ──────────────────────────────────────────────────
  readonly formatModel = signal({ montoColones: '', montoDolares: '', cantidad: '', descripcion: '', correo: '' });
  readonly ff = form(this.formatModel, (p) => {
    required(p.correo, { message: 'El correo es requerido' });
    minLength(p.correo, 6, { message: 'Mínimo 6 caracteres' });
    pattern(p.correo, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, { message: 'Formato de correo inválido' });
  });
}
