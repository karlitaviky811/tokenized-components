import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-app-bar-page',
  standalone: true,
  imports: [],
  templateUrl: './app-bar.page.html',
  styleUrl: './app-bar.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarPage {}
