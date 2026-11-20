import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibButtonComponent, LibCardComponent, LibIconButtonComponent, LibStackedCardComponent } from 'crdx-components';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [LibButtonComponent, LibCardComponent, LibIconButtonComponent, LibStackedCardComponent],
  templateUrl: './card.page.html',
  styleUrl: './card.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
