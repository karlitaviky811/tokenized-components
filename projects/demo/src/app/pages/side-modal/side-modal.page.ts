import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-side-modal-page',
  standalone: true,
  imports: [],
  templateUrl: './side-modal.page.html',
  styleUrl: './side-modal.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideModalPage {}
