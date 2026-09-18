import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { LibSelectFieldComponent } from 'crdx-components';

@Component({
  selector: 'app-select-field-page',
  standalone: true,
  imports: [LibSelectFieldComponent, FormField],
  templateUrl: './select-field.page.html',
  styleUrl: './select-field.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldPage {
  // Modelo del Signal Form: un objeto con un campo por select.
  // form() envuelve el WritableSignal; cada campo es un FieldTree independiente.
  // El campo `validated` arranca vacío y tiene una regla required → muestra error
  // al cerrar el panel sin elegir opción.
  protected readonly countryModel = signal({ outline: 'co', filled: 'mx', validated: '', suppressed: '' });
  protected readonly countryForm = form(this.countryModel, (path) => {
    required(path.validated, { message: 'Debes seleccionar un país' });
    required(path.suppressed, { message: 'Debes seleccionar un país' });
  });

  protected readonly options = signal([
    { value: 'co', label: 'Colombia'  },
    { value: 'mx', label: 'México'    },
    { value: 'ar', label: 'Argentina' },
    { value: 'pe', label: 'Perú'      },
    { value: 'cl', label: 'Chile'     },
    { value: 'uy', label: 'Uruguay'   },
    { value: 'bo', label: 'Bolivia'   },
    { value: 've', label: 'Venezuela' },
    { value: 'ec', label: 'Ecuador'   },
    { value: 'py', label: 'Paraguay'  },
  ]);
}
