import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibSelectFieldComponent } from 'crdx-components';

@Component({
  selector: 'app-select-field-page',
  standalone: true,
  imports: [LibSelectFieldComponent, FormsModule],
  templateUrl: './select-field.page.html',
  styleUrl: './select-field.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldPage {
  selectedCountry = 'co';

  protected readonly options = signal([
    { value: 'co', label: 'Colombia'  },
    { value: 'mx', label: 'México'    },
    { value: 'ar', label: 'Argentina' },
    { value: 'pe', label: 'Perú'      },
  ]);
}
