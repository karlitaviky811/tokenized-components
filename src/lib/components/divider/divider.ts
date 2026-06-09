import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-divider',
  standalone: true,
  templateUrl: './divider.html',
  styleUrl: './divider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibDividerComponent {
  /** Orientación: horizontal (full width) o vertical (full height). Figma: Horizontal/Full-width, Vertical/Full-width */
  orientation = input<'horizontal' | 'vertical'>('horizontal');
}
