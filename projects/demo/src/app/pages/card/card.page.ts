import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibCardComponent, LibIconButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [LibCardComponent, LibIconButtonComponent],
  templateUrl: './card.page.html',
  styleUrl: './card.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
