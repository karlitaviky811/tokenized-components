import { ChangeDetectionStrategy, Component, computed, effect, input, model, output, signal, viewChild } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DisabledReason, FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatFormFieldAppearance, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

type LibTextFieldAppearance = MatFormFieldAppearance | 'outlined' | 'filled';
export type LibTextFieldFormat = 'id' | 'currency' | 'numeric' | 'alphanumeric' | 'email';

@Component({
  selector: 'lib-text-field',
  standalone: true,
  imports: [MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix, MatInput, MatIcon, MatRippleModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibTextFieldComponent implements FormValueControl<string> {
  readonly value = model<string>('');
  readonly disabled = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly required = input<boolean>(false);
  readonly touch = output<void>();

  // Component-specific inputs
  readonly label = input.required<string>();
  readonly appearance = input<LibTextFieldAppearance>('outline');
  readonly suffixIcon = input<string>('');
  readonly suffixTextIcon = input<string>('');
  readonly prefixIcon = input<string>('');
  readonly prefixIconSrc = input<string>('');
  readonly error = input<string | null>(null);
  readonly hint = input<string>('');
  readonly suffixEvent = output<void>();
  readonly showSuffix = input(false, { transform: coerceBooleanProperty });
  readonly suffixIconBand = input(false, { transform: coerceBooleanProperty });
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('off');
  readonly fullWidth = input(false, { transform: coerceBooleanProperty });
  readonly width = input<string | null, string | number | null>(null, {
    transform: (value) => {
      if (value == null || value === '') return null;
      return typeof value === 'number' ? `${value}px` : String(value);
    },
  });
  readonly type = input<string>('text');
  readonly hideRequiredMarker = input(false, { transform: coerceBooleanProperty });
  readonly loading = input(false, { transform: coerceBooleanProperty });

  readonly format = input<LibTextFieldFormat>('alphanumeric');
  readonly mask = input<string>('');
  readonly currencySymbol = input<'$' | '₡'>('₡');
  readonly charLimit = input<number | null>(null);

  readonly resolvedAppearance = computed<MatFormFieldAppearance>(() => {
    const raw = this.appearance();
    if (raw === 'outlined') return 'outline';
    if (raw === 'filled') return 'fill';
    return raw;
  });

  readonly widthStyle = computed(() => (this.fullWidth() ? '100%' : this.width()));

  readonly shouldShowSuffix = computed(
    () => this.showSuffix() || (this.suffixIconBand() && (!!this.suffixIcon() || !!this.suffixTextIcon()))
  );

  private readonly _showErrors = signal(false);

  readonly shouldShowError = computed(
    () => (this.invalid() && this._showErrors()) || !!this.error()
  );

  readonly resolvedType = computed(() => this.format() === 'email' ? 'email' : 'text');

  readonly ngxMask = computed(() => {
    switch (this.format()) {
      case 'id': return this.mask().replace(/#/g, '0').replace(/X/g, 'A');
      case 'currency':
      case 'numeric': return 'separator.2';
      default: return '';
    }
  });

  readonly ngxPrefix = computed(() =>
    this.format() === 'currency' ? `${this.currencySymbol()} ` : ''
  );

  readonly usesMask = computed(() => !!this.ngxMask());

  private readonly matInput = viewChild(MatInput);

  constructor() {
    effect(() => {
      const input = this.matInput();
      if (input) {
        input.errorState = this.shouldShowError();
      }
    });
  }

  _onValueChange(val: string): void {
    this.value.set(val);
    this._showErrors.set(false);
  }

  _onBlur(): void {
    if (this.invalid()) {
      this._showErrors.set(true);
    }
    this.touch.emit();
  }

  pressSuffixEvent(): void {
    this.suffixEvent.emit();
  }

  blockSpaceForEmail(event: KeyboardEvent): void {
    if (this.format() === 'email' && event.key === ' ') {
      event.preventDefault();
    }
  }
}
