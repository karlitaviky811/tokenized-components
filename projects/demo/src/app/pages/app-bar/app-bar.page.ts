import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibHeaderComponent } from 'crdx-components';

@Component({
  selector: 'app-app-bar-page',
  standalone: true,
  imports: [LibHeaderComponent],
  templateUrl: './app-bar.page.html',
  styleUrl: './app-bar.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarPage {}
