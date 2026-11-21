import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-lib-ui',
  imports: [],
  templateUrl: './lib-ui.html',
  styleUrl: './lib-ui.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibUi {}
