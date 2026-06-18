import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'lib-radio-button',
  standalone: true,
  imports: [MatRadioModule],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibRadioButtonComponent {
  value = input<unknown>(null);
  disabled = input(false);
  checked = input(false);

  readonly checkedChange = output<unknown>();

  @HostBinding('attr.aria-disabled') get ariaDisabled(): boolean | null {
    return this.disabled() ? true : null;
  }
}
