import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibDividerComponent } from 'crdx-components';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [LibDividerComponent],
  templateUrl: './layout.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPage {}