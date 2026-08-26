import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DisabledReason, FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

type LibTextFieldAppearance = MatFormFieldAppearance | 'outlined' | 'filled';

@Component({
  selector: 'lib-text-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibTextFieldComponent implements FormValueControl<string> {
  // FormValueControl contract
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
  readonly shouldShowError = computed(() => this.invalid() || !!this.error());

  pressSuffixEvent(): void {
    this.suffixEvent.emit();
  }
}
