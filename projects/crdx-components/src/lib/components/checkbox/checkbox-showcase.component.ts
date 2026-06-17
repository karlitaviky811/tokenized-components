import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibCheckboxComponent } from './checkbox';

@Component({
  selector: 'lib-checkbox-showcase',
  standalone: true,
  imports: [LibCheckboxComponent],
  templateUrl: './checkbox-showcase.component.html',
  styleUrls: ['./checkbox-showcase.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibCheckboxShowcaseComponent {}

