import { Component } from '@angular/core';
import { CircularProgressStepper } from 'crdx-components';

@Component({
  selector: 'app-progress-stepper-page',
  standalone: true,
  imports: [CircularProgressStepper],
  templateUrl: './progress-stepper.page.html',
  styleUrl: './progress-stepper.page.scss',
})
export class ProgressStepperPage {}
