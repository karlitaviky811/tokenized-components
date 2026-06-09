import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { LibCheckboxComponent } from '../checkbox/checkbox';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
  imports: [MatFormFieldModule, MatSelectModule, ScrollingModule, MatInputModule, MatIconModule, LibCheckboxComponent],
  templateUrl: './select-field.html',
  styleUrl: './select-field.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LibSelectFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSelectFieldComponent<T = string> implements ControlValueAccessor, OnInit {
  private static readonly PANEL_CONTENT_HEIGHT = 240;
  private static readonly FILTER_ROW_HEIGHT = 48;
  private static readonly OPTION_ROW_HEIGHT = 48;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private ngControl: NgControl | null = null;

  readonly label = input('');
  readonly appearance = input<'outline' | 'filled'>('outline');
  readonly placeholder = input('Elegir opción');
  readonly options = input<LibSelectOption<T>[]>([]);
  readonly mode = input<LibSelectMode>('single');
  readonly filterable = input(true, { transform: coerceBooleanProperty });
  readonly filterPlaceholder = input('Buscar...');
  readonly disabled = input(false, { transform: coerceBooleanProperty });
  readonly required = input(false, { transform: coerceBooleanProperty });
  readonly width = input<string | number | null>(null);
  readonly selectAllLabel = input('Seleccionar todos');
  readonly widthStyle = computed(() => {
    const v = this.width();
    return v == null || v === '' ? null : typeof v === 'number' ? `${v}px` : String(v);
  });
  readonly matAppearance = computed<MatFormFieldAppearance>(() =>
    this.appearance() === 'filled' ? 'fill' : 'outline'
  );

  readonly valueChange = output<T | T[]>();

  readonly panelOpen = signal(false);
  readonly filterTerm = signal('');
  readonly disabledByControl = signal(false);

  readonly isMultiple = computed(() => this.mode() === 'multiple');
  readonly virtualViewportMaxHeight = computed(() =>
    this.filterable()
      ? LibSelectFieldComponent.PANEL_CONTENT_HEIGHT - LibSelectFieldComponent.FILTER_ROW_HEIGHT
      : LibSelectFieldComponent.PANEL_CONTENT_HEIGHT
  );

  readonly filteredOptions = computed(() => {
    const opts = this.options();
    const term = this.filterTerm().trim().toLowerCase();
    if (!term) return opts;
    return opts.filter(
      (o) => o.label.toLowerCase().includes(term)
    );
  });

  readonly virtualRows = computed<VirtualRow<T>[]>(() => {
    const rows: VirtualRow<T>[] = this.filteredOptions().map((option) => ({
      kind: 'option',
      option,
    }));

    if (this.isMultiple()) {
      rows.unshift({ kind: 'selectAll' });
    }

    return rows;
  });

  readonly virtualViewportHeight = computed(() => {
    const rowsCount = this.virtualRows().length;
    const contentHeight = rowsCount * LibSelectFieldComponent.OPTION_ROW_HEIGHT;
    const maxHeight = this.virtualViewportMaxHeight();
    const minHeight = rowsCount > 0 ? LibSelectFieldComponent.OPTION_ROW_HEIGHT : 0;

    return Math.max(minHeight, Math.min(contentHeight, maxHeight));
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

  private readonly value = signal<T | T[] | null>(null);
  private onChange: (v: T | T[] | null) => void = () => {
    /* assigned by registerOnChange */
  };
  private onTouched: () => void = () => {
    /* assigned by registerOnTouched */
  };

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    if (this.ngControl?.valueChanges) {
      this.ngControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.cdr.markForCheck());
    }
  }

  onPanelOpenChange(open: boolean): void {
    this.panelOpen.set(open);
    if (!open) this.filterTerm.set('');
    this.cdr.markForCheck();
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

      // Ignore synthetic values emitted by the auxiliary "select all" option.
      if (hasUnknownValues) {
        this.cdr.markForCheck();
        return;
      }

      const incomingSet = new Set(incoming);
      const normalized = options.filter((v) => incomingSet.has(v)) as T[];
      this.value.set(normalized);
      this.onChange(normalized);
      this.valueChange.emit(normalized);
      this.cdr.markForCheck();
      return;
    }

    this.value.set(change.value);
    this.onChange(change.value);
    this.valueChange.emit(change.value);
    this.cdr.markForCheck();
  }

  onToggleSelectAll(checked: boolean): void {
    if (!this.isMultiple()) {
      return;
    }
    const options = this.options();
    const currentValue = this.value();
    const current = Array.isArray(currentValue) ? [...currentValue] : [];
    if (checked) {
      const toAdd = options.map((o) => o.value);
      const set = new Set(current);
      for (const v of toAdd) {
        set.add(v);
      }
      this.value.set(Array.from(set) as T[]);
    } else {
      const toRemove = new Set(options.map((o) => o.value));
      this.value.set(current.filter((v) => !toRemove.has(v as T)) as T[]);
    }
    const updated = this.value();
    this.onChange(updated);
    this.valueChange.emit(updated as T | T[]);
    this.cdr.markForCheck();
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
    this.value.set(Array.from(set) as T[]);
    const updated = this.value();
    this.onChange(updated);
    this.valueChange.emit(updated as T | T[]);
    this.cdr.markForCheck();
  }

  writeValue(value: T | T[] | null): void {
    this.value.set(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (v: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByControl.set(isDisabled);
    this.cdr.markForCheck();
  }

  get displayValue(): T | T[] | null {
    return this.value();
  }

  toggledAllSelection(){
    if (this.allSelected()) {
      this.onToggleSelectAll(false);
      return;
    }
    this.onToggleSelectAll(true);
  }


  isSelected(value: T): boolean {
    const current = this.value();
    if (!Array.isArray(current)) {
      return false;
    }
    return current.includes(value);
  }

  trackByVirtualRow(_index: number, row: VirtualRow<T>): string {
    return row.kind === 'selectAll' ? '__select-all__' : String(row.option.value);
  }
}
