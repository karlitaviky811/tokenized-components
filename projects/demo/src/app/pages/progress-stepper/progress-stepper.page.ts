import { Component } from '@angular/core';
import { LibCircularProgressStepperComponent } from 'crdx-components';

@Component({
  selector: 'app-progress-stepper-page',
  standalone: true,
  imports: [LibCircularProgressStepperComponent],
  templateUrl: './progress-stepper.page.html',
  styleUrl: './progress-stepper.page.scss',
})
export class ProgressStepperPage {}
