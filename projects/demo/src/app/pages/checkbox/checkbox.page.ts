import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibCheckboxComponent } from 'crdx-components';

@Component({
  selector: 'app-checkbox-page',
  standalone: true,
  imports: [LibCheckboxComponent],
  templateUrl: './checkbox.page.html',
  styleUrl: './checkbox.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxPage {}
