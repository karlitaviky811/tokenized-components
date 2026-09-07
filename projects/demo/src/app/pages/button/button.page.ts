import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './button.page.html',
  styleUrl: './button.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
