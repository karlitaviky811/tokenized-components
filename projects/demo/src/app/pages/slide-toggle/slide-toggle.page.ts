import { Component, signal } from '@angular/core';
import { SlideToggle } from 'crdx-components';

@Component({
  selector: 'app-slide-toggle-page',
  standalone: true,
  imports: [SlideToggle],
  templateUrl: './slide-toggle.page.html',
  styleUrl: './slide-toggle.page.scss',
})
export class SlideTogglePage {
  active = signal(false);
}
