import { Component } from '@angular/core';
import { LibSpinnerComponent, LibTooltipComponent, CircularProgressStepper } from 'crdx-components';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [LibSpinnerComponent, LibTooltipComponent, CircularProgressStepper],
  templateUrl: './feedback.page.html',
})
export class FeedbackPage {}