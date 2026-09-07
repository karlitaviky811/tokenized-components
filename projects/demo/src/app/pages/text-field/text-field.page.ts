import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { disabled, form, FormField, required } from '@angular/forms/signals';
import { LibTextFieldComponent } from 'crdx-components';

@Component({
  selector: 'app-text-field-page',
  standalone: true,
  imports: [FormField, LibTextFieldComponent],
  templateUrl:  './text-field.page.html',
  styleUrl: './text-field.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldPage {
  readonly model = signal({ name: '', email: '', error: '', hint: '', disabled: '' });
  readonly f = form(this.model, (p) => {
    disabled(p.disabled);
    required(p.error, { message: 'Campo requerido' });
  });
}
