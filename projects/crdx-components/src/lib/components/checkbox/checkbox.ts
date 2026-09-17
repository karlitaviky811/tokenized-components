import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [MatCheckbox],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-disabled]': 'disabled() ? true : null',
  },
})
export class LibCheckboxComponent {
  checked = input(false);
  indeterminate = input(false);
  disabled = input(false);
  error = input(false);
  labelId = input<string | null>(null);

  readonly checkedChange = output<boolean>();
  readonly indeterminateChange = output<boolean>();

    matcher: ErrorStateMatcher = {
    isErrorState: () => this.error()
  };


  protected readonly ariaChecked = computed(() => {
    if (this.indeterminate()) return 'mixed';
    return this.checked() ? 'true' : 'false';
  });

  protected onAction(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;
    if (this.indeterminate()) {
      this.indeterminateChange.emit(false);
      this.checkedChange.emit(true);
    } else {
      this.checkedChange.emit(!this.checked());
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onAction(event);
    }
  }

  protected onMatCheckboxChange(event: MatCheckboxChange): void {
    this.checkedChange.emit(event.checked);
    if (event.checked && this.indeterminate()) {
      this.indeterminateChange.emit(false);
    }
  }
}
