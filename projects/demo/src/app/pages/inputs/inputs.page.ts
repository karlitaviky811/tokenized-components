import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import { LibTextFieldComponent, LibSelectFieldComponent, LibCheckboxComponent, LibRadioButtonComponent } from 'crdx-components';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-inputs-page',
  standalone: true,
  imports: [FormField, LibTextFieldComponent, LibSelectFieldComponent, LibCheckboxComponent, LibRadioButtonComponent, MatRadioModule],
  templateUrl: './inputs.page.html',
  styleUrl: './inputs.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputsPage {
  readonly textModel = signal({ name: '', email: '', error: '', hint: '', disabled: '' });
  readonly textForm = form(this.textModel, (p) => {
    disabled(p.disabled);
  });

  selectedCard = signal('classic');
  protected readonly selectOptions = signal([
    { value: 'co', label: 'Colombia' },
    { value: 'mx', label: 'México' },
    { value: 'ar', label: 'Argentina' },
    { value: 'pe', label: 'Perú' },
  ]);
}