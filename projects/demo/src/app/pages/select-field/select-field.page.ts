import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibSelectFieldComponent } from 'crdx-components';

@Component({
  selector: 'app-select-field-page',
  standalone: true,
  imports: [LibSelectFieldComponent],
  templateUrl: './select-field.page.html',
  styleUrl: './select-field.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldPage {
  protected readonly options = signal([
    { value: 'co', label: 'Colombia'  },
    { value: 'mx', label: 'México'    },
    { value: 'ar', label: 'Argentina' },
    { value: 'pe', label: 'Perú'      },
  ]);
}
