import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibSpinnerComponent } from 'crdx-components';

@Component({
  selector: 'app-spinner-page',
  standalone: true,
  imports: [LibSpinnerComponent],
  templateUrl: './spinner.page.html',
  styleUrl: './spinner.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerPage {}
