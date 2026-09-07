import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibDividerComponent } from 'crdx-components';

@Component({
  selector: 'app-divider-page',
  standalone: true,
  imports: [LibDividerComponent],
  templateUrl: './divider.page.html',
  styleUrl: './divider.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPage {}
