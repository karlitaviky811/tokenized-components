import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'lib-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSpinnerComponent {
  diameter = input<number>(48);
  strokeWidth = input<number>(4);
  color = input<string>('var(--Rojo-400, #e30613)');
  ariaLabel = input<string>('Cargando');
}

