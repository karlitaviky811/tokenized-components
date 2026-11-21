import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LibButtonComponent } from 'crdx-components';

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [LibButtonComponent],
  templateUrl: './button.page.html',
  styleUrl: './button.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);



  constructor() {
    this.iconRegistry.addSvgIcon(
      'add-create',
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
