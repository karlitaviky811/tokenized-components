import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

@Component({
  selector: 'lib-circular-progress-stepper, circular-progress-stepper',
  imports: [],
  templateUrl: './circular-progress-stepper.html',
  styleUrl: './circular-progress-stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircularProgressStepper {
  currentStep = input<number>(0);
  totalsStep = input<number>(0);
  size = input<string>('64px');
  barWidth = input<string>('10px');
  colorBarProgress = input<string>('#0BC626');
  shadowColorBarProgress = input<string>('#F0F0F0');
  noJsMessage = input<string>('Esta función requiere JavaScript 😢');
  animationDuration = input<number>(500);

  progress = signal<number>(0);
  isAnimating = signal<boolean>(false);
  jsEnabled = signal<boolean>(true);
  progressPercentage = computed(() => `${this.progress()}%`);


  constructor() {
    effect(() => {
      this.updateProgress();
    });
  }

  updateProgress(): void {
    const previousStep = (this.currentStep() > 0) ? this.currentStep() - 1 : 0;
    const previousProgress = (Math.round(previousStep) / Math.round(this.totalsStep())) * 100;
    this.progress.set(Math.round(previousProgress));
    const progress = (Math.round(this.currentStep()) / Math.round(this.totalsStep())) * 100;
    setTimeout(() => {
      this.progress.set(Math.round(progress));
    }, 100);
  }
}
