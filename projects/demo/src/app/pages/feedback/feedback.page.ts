import { Component } from '@angular/core';
import { LibSpinnerComponent, LibTooltipComponent, LibCircularProgressStepperComponent } from 'crdx-components';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [LibSpinnerComponent, LibTooltipComponent, LibCircularProgressStepperComponent],
  templateUrl: './feedback.page.html',
})
export class FeedbackPage {}