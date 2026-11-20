import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { MatFormFieldAppearance, MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRippleModule, ErrorStateMatcher } from '@angular/material/core';
import { MatSelect, MatSelectTrigger, MatOption, MatSelectChange } from '@angular/material/select';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { LibCheckboxComponent } from '../checkbox/checkbox';

export interface LibSelectOption<T = string> {
  value: T;
  label: string;
}

type VirtualRow<T> =
  | { kind: 'selectAll' }
  | { kind: 'option'; option: LibSelectOption<T> };

export type LibSelectMode = 'single' | 'multiple';

@Component({
  selector: 'lib-select-field',
  standalone: true,
  imports: [MatFormField, MatLabel, MatSuffix, MatError, MatSelect, MatSelectTrigger, MatOption, MatIcon, MatRippleModule, LibCheckboxComponent],
  templateUrl: './select-field.html',
  styleUrl: './select-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
})
export class LibSelectFieldComponent<T = string> implements FormValueControl<T | T[] | null> {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly matSelectRef = viewChild(MatSelect);

  // === Signal Forms — FormValueControl API ===
  // La directiva [formField] enlaza estos miembros automáticamente:
  // value (two-way), errors, invalid, disabled, required y touch.
  readonly value = model<T | T[] | null>(null);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly invalid = input<boolean>(false);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly touch = output<void>();
  // Nota: el model `value` ya genera automáticamente el output `valueChange`
  // (se emite en cada value.set()), así que no declaramos uno propio.

  // === Inputs propios del componente ===
  readonly label = input('');
  readonly appearance = input<'outline' | 'filled'>('outline');
  readonly placeholder = input('Elegir opción');
  readonly options = input<LibSelectOption<T>[]>([]);
  readonly mode = input<LibSelectMode>('single');
  readonly filterable = input(true, { transform: coerceBooleanProperty });
  readonly filterPlaceholder = input('Buscar...');
  // `error` declarativo (opcional): fuerza el estado de error sin form.
  readonly error = input<string | null>(null);
  // Controla solo la visibilidad del MENSAJE de error. El estado de error
  // (borde rojo) se mantiene mientras el campo sea inválido; con showError=false
  // simplemente no se renderiza el <mat-error>.
  readonly showError = input(true, { transform: coerceBooleanProperty });
  readonly width = input<string | number | null>(null);
  readonly fullWidth = input(false, { transform: coerceBooleanProperty });
  readonly selectAllLabel = input('Seleccionar todos');
  readonly hideSubscript = input(false, { transform: coerceBooleanProperty });

  readonly filterTerm = signal('');

  readonly widthStyle = computed(() => {
    if (this.fullWidth()) return '100%';
    const v = this.width();
    return v == null || v === '' ? null : typeof v === 'number' ? `${v}px` : String(v);
  });
  readonly matAppearance = computed<MatFormFieldAppearance>(() =>
    this.appearance() === 'filled' ? 'fill' : 'outline'
  );

  // Solo mostramos el error del form tras interacción (blur = cerrar el panel),
  // igual que text-field. El input `error` declarativo lo fuerza siempre.
  private readonly _showErrors = signal(false);
  // Estado de error (borde rojo): NO depende de showError.
  readonly shouldShowError = computed(
    () => (this.invalid() && this._showErrors()) || !!this.error()
  );
  // Mensaje de error: se oculta cuando showError es false (el borde se mantiene).
  readonly errorMessage = computed(() =>
    this.showError() ? (this.error() ?? this.errors()[0]?.message ?? '') : ''
  );

  // mat-select recalcula su errorState vía updateErrorState() usando este matcher.
  // Devolvemos nuestro shouldShowError() para controlar el estado de error de forma
  // declarativa (mismo patrón que lib-checkbox), sin depender del ErrorStateMatcher
  // por defecto (que exige un ngControl + touched).
  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.shouldShowError(),
  };

  readonly isMultiple = computed(() => this.mode() === 'multiple');

  readonly filteredOptions = computed(() => {
    const opts = this.options();
    const term = this.filterTerm().trim().toLowerCase();
    if (!term) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(term));
  });

  readonly rows = computed<VirtualRow<T>[]>(() => {
    const rows: VirtualRow<T>[] = this.filteredOptions().map((option) => ({
      kind: 'option',
      option,
    }));
    if (this.isMultiple()) {
      rows.unshift({ kind: 'selectAll' });
    }
    return rows;
  });

  readonly allSelected = computed(() => {
    if (!this.isMultiple()) {
      return false;
    }
    const opts = this.options();
    const current = this.value();
    if (!Array.isArray(current) || !opts.length) {
      return false;
    }
    const values = opts.map((o) => o.value);
    return values.every((v) => current.includes(v));
  });

  readonly selectedLabels = computed(() => {
    const current = this.value();
    if (!Array.isArray(current) || !current.length) {
      return [] as string[];
    }
    const selectedSet = new Set(current);
    return this.options()
      .filter((o) => selectedSet.has(o.value))
      .map((o) => o.label);
  });

  readonly multiTriggerLabel = computed(() => {
    const labels = this.selectedLabels();
    if (!labels.length) {
      return '';
    }
    if (labels.length === 1) {
      return labels[0];
    }
    return `${labels[0]} (+${labels.length - 1} items)`;
  });

  readonly selectAllIndeterminate = computed(() => {
    if (!this.isMultiple()) {
      return false;
    }
    const opts = this.options();
    const current = this.value();
    if (!Array.isArray(current) || !opts.length) {
      return false;
    }
    const selectedCount = opts.filter((o) => current.includes(o.value)).length;
    return selectedCount > 0 && selectedCount < opts.length;
  });

  readonly displayValue = computed<T | T[] | null>(() =>
    this.isMultiple() ? null : this.value()
  );

  constructor() {
    // Reflejamos nuestro estado de error (declarativo o del form) directamente en
    // mat-select.errorState — que es el control que mat-form-field consulta para
    // pintar el borde rojo y mostrar el <mat-error>. Mismo patrón que text-field
    // con matInput.errorState. El [errorStateMatcher] bindeado evita que los
    // recálculos internos de mat-select reseteen este valor.
    effect(() => {
      const select = this.matSelectRef();
      if (select) {
        select.errorState = this.shouldShowError();
        select.stateChanges.next();
      }
    });
  }

  onPanelOpenChange(open: boolean): void {
    this.el.nativeElement.classList.toggle('lib-select-field--panel-open', open);
    if (open) {
      this.filterTerm.set('');
    } else {
      // Cerrar el panel = blur: marca el control como tocado y habilita mostrar
      // el error de validación del form.
      if (this.invalid()) {
        this._showErrors.set(true);
      }
      this.touch.emit();
    }
  }

  onFilterInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.filterTerm.set(el?.value ?? '');
  }

  onFilterKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  onSelectionChange(change: MatSelectChange): void {
    if (this.isMultiple()) {
      const incoming = Array.isArray(change.value) ? (change.value as T[]) : [];
      const options = this.options().map((o) => o.value);
      const optionSet = new Set(options);
      const hasUnknownValues = incoming.some((v) => !optionSet.has(v));

      if (hasUnknownValues) {
        return;
      }

      const incomingSet = new Set(incoming);
      const normalized = options.filter((v) => incomingSet.has(v)) as T[];
      this.commitValue(normalized);
      return;
    }

    this.commitValue(change.value);
  }

  onToggleSelectAll(checked: boolean): void {
    if (!this.isMultiple()) {
      return;
    }
    const options = this.options();
    const currentValue = this.value();
    const current = Array.isArray(currentValue) ? [...currentValue] : [];
    if (checked) {
      const set = new Set(current);
      for (const v of options.map((o) => o.value)) {
        set.add(v);
      }
      this.commitValue(Array.from(set) as T[]);
    } else {
      const toRemove = new Set(options.map((o) => o.value));
      this.commitValue(current.filter((v) => !toRemove.has(v as T)) as T[]);
    }
  }

  onSelectAllCheckedChange(checked: boolean): void {
    this.onToggleSelectAll(checked);
  }

  onOptionCheckedChange(value: T, checked: boolean): void {
    if (!this.isMultiple()) {
      return;
    }
    const currentValue = this.value();
    const current = Array.isArray(currentValue) ? [...currentValue] : [];
    const set = new Set(current);
    if (checked) {
      set.add(value);
    } else {
      set.delete(value);
    }
    this.commitValue(Array.from(set) as T[]);
  }

  toggleAllSelection(): void {
    this.onToggleSelectAll(!this.allSelected());
  }

  isSelected(value: T): boolean {
    const current = this.value();
    if (!Array.isArray(current)) {
      return false;
    }
    return current.includes(value);
  }

  trackByRow(_index: number, row: VirtualRow<T>): string {
    return row.kind === 'selectAll' ? '__select-all__' : String(row.option.value);
  }

  // Escribe en el model (propaga al form vía [formField] y emite valueChange
  // automáticamente) y oculta el error mientras el usuario corrige la selección.
  private commitValue(next: T | T[]): void {
    this.value.set(next);
    this._showErrors.set(false);
  }
}
