import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface LibMenuOption<T = string> {
  value: T;
  label: string;
}

export type LibMenuMode = 'single' | 'multiple';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LibMenuComponent),
      multi: true,
    },
  ],
})
/**
 * @deprecated Prefer `lib-select-field` for new implementations.
 * Kept for compatibility while migrating existing screens.
 */
export class LibMenuComponent<T = string> implements ControlValueAccessor {
  readonly label = input<string | null>(null);
  readonly placeholder = input('Seleccionar');
  readonly options = input<LibMenuOption<T>[]>([]);
  readonly mode = input<LibMenuMode>('single');
  readonly filterable = input(true);
  readonly disabled = input(false);

  readonly panelOpen = signal(false);
  readonly filterTerm = signal('');
  readonly disabledByControl = signal(false);

  readonly valueSignal = signal<T | T[] | null>(null);

  readonly isMultiple = computed(() => this.mode() === 'multiple');

  readonly filteredOptions = computed(() => {
    const opts = this.options();
    const term = this.filterTerm().trim().toLowerCase();
    if (!term) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(term));
  });

  readonly triggerLabel = computed(() => {
    const current = this.valueSignal();
    const opts = this.options();
    if (current == null) {
      return this.placeholder();
    }
    if (Array.isArray(current)) {
      if (!current.length) return this.placeholder();
      const labels = current
        .map((v) => opts.find((o) => o.value === v)?.label)
        .filter((l): l is string => !!l);
      if (!labels.length) return this.placeholder();
      if (labels.length === 1) return labels[0];
      const [first, ...rest] = labels;
      return `${first} (+${rest.length})`;
    }
    const match = opts.find((o) => o.value === current);
    return match?.label ?? this.placeholder();
  });

  onMenuOpened(): void {
    this.panelOpen.set(true);
  }

  onMenuClosed(): void {
    this.panelOpen.set(false);
    this.filterTerm.set('');
  }

  onFilterInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.filterTerm.set(el?.value ?? '');
  }

  onOptionClick(option: LibMenuOption<T>, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.isMultiple()) {
      const current = this.valueSignal();
      const asArray = Array.isArray(current) ? [...current] : [];
      const index = asArray.findIndex((v) => v === option.value);
      if (index >= 0) {
        asArray.splice(index, 1);
      } else {
        asArray.push(option.value);
      }
      const next = asArray as T[];
      this.valueSignal.set(next);
      this.onChange(next);
    } else {
      const next = option.value;
      this.valueSignal.set(next);
      this.onChange(next);
    }
  }

  isSelected(value: T): boolean {
    const current = this.valueSignal();
    if (Array.isArray(current)) {
      return current.includes(value);
    }
    return current === value;
  }

  // ControlValueAccessor
  private onChange: (value: T | T[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | T[] | null): void {
    this.valueSignal.set(value);
  }

  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByControl.set(isDisabled);
  }
}

