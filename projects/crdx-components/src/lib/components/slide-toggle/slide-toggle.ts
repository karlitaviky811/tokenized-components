import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'lib-slide-toggle',
  standalone: true, 
  imports: [MatSlideToggleModule],
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSlideToggleComponent {
  checked = input(false);
  checkedChange = output<boolean>();

  onChange(event: MatSlideToggleChange) {
    this.checkedChange.emit(event.checked);
  }
}
