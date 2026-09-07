import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibRadioButtonComponent } from 'crdx-components';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-radio-button-page',
  standalone: true,
  imports: [LibRadioButtonComponent, MatRadioModule],
  templateUrl: './radio-button.page.html',
  styleUrl: './radio-button.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonPage {
  selected = signal('classic');
}
