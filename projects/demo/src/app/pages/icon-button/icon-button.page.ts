import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LibIconButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-icon-button-page',
  standalone: true,
  imports: [LibIconButtonComponent, MatIconModule],
  templateUrl: './icon-button.page.html',
  styleUrl: './icon-button.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonPage {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry.addSvgIcon(
      'add-create-filled',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/circle_outline_xs.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add-create-tonal',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_circle_tonal_xs.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add-create-elevated',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_cicrle_elevated_xs.svg')
    );

  }

}
