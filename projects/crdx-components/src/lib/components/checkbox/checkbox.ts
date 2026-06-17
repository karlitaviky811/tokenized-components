import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  HostBinding,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibCheckboxComponent {
  checked = input(false);
  indeterminate = input(false);
  disabled = input(false);
  error = input(false);
  /** Id para asociar label (accesibilidad). Si no se pasa, se genera uno interno. */
  labelId = input<string | null>(null);

  readonly checkedChange = output<boolean>();
  readonly indeterminateChange = output<boolean>();

  @HostBinding('attr.aria-disabled') get ariaDisabled(): boolean | null {
    return this.disabled() ? true : null;
  }

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
