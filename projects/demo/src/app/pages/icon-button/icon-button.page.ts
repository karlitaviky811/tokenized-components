import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibIconButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-icon-button-page',
  standalone: true,
  imports: [LibIconButtonComponent],
  templateUrl: './icon-button.page.html',
  styleUrl: './icon-button.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonPage {}
