import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

type LibTextFieldAppearance = MatFormFieldAppearance | 'outlined' | 'filled';

@Component({
  selector: 'lib-text-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibTextFieldComponent {
  private disabledAppliedByInput = false;

  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly appearance = input<LibTextFieldAppearance>('outline');
  /**
   * @deprecated Use `appearance`. Kept for compatibility.
   */
  readonly apperance = input<LibTextFieldAppearance | null>(null);
  readonly suffixIcon = input<string>('');
  readonly suffixTextIcon = input<string>('');
  readonly prefixIcon = input<string>('');
  readonly prefixIconSrc = input<string>('');
  /**
   * @deprecated Use `prefixIcon`. Kept for compatibility.
   */
  readonly preffixIcon = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly errorState = input<boolean | null>(null);
  readonly hint = input<string>('');
  readonly suffixEvent = output<void>();
  readonly showSuffix = input(false, { transform: coerceBooleanProperty });
  readonly suffixIconBand = input(false, { transform: coerceBooleanProperty });
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('off');
  readonly fullWidth = input(false, { transform: coerceBooleanProperty });
  readonly width = input<string | null, string | number | null>(null, {
    transform: (value) => {
      if (value == null || value === '') {
        return null;
      }
      return typeof value === 'number' ? `${value}px` : String(value);
    },
  });
  readonly disabled = input(false, { transform: coerceBooleanProperty });
  readonly type = input<string>('text');
  readonly hideRequiredMarker = input(false, { transform: coerceBooleanProperty });

  readonly resolvedAppearance = computed<MatFormFieldAppearance>(() => {
    const raw = this.apperance() ?? this.appearance();
    if (raw === 'outlined') return 'outline';
    if (raw === 'filled') return 'fill';
    return raw;
  });
  readonly resolvedPrefixIcon = computed(() => this.preffixIcon() ?? this.prefixIcon());
  readonly widthStyle = computed(() => (this.fullWidth() ? '100%' : this.width()));
  readonly shouldShowSuffix = computed(
    () => this.showSuffix() || (this.suffixIconBand() && (!!this.suffixIcon() || !!this.suffixTextIcon()))
  );
  readonly shouldShowError = computed(() => {
    const forcedError = this.errorState();
    if (forcedError !== null) {
      return forcedError;
    }

    const control = this.control();
    return control.invalid && (control.dirty || control.touched);
  });

  constructor() {
    effect(() => {
      const control = this.control();
      const shouldDisable = this.disabled();

      if (shouldDisable) {
        if (control.enabled) {
          control.disable({ emitEvent: false });
        }
        this.disabledAppliedByInput = true;
        return;
      }

      if (this.disabledAppliedByInput && control.disabled) {
        control.enable({ emitEvent: false });
      }

      this.disabledAppliedByInput = false;
    });
  }

  pressSuffixEvent(): void {
    this.suffixEvent.emit();
  }
}
