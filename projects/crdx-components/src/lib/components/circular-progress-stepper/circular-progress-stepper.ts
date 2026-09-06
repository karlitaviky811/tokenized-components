import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';

@Component({
  selector: 'lib-circular-progress-stepper',
  standalone: true,
  imports: [],
  templateUrl: './circular-progress-stepper.html',
  styleUrl: './circular-progress-stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibCircularProgressStepperComponent {
  currentStep = input<number>(0);
  totalSteps = input<number>(0);
  size = input<string>('64px');
  barWidth = input<string>('10px');
  colorBarProgress = input<string>('#0BC626');
  shadowColorBarProgress = input<string>('#F0F0F0');
  noJsMessage = input<string>('Esta función requiere JavaScript 😢');
  animationDuration = input<number>(100);

  progress = signal<number>(0);
  isAnimating = signal<boolean>(false);
  jsEnabled = signal<boolean>(true);
  progressPercentage = computed(() => `${this.progress()}%`);

  private readonly destroyRef = inject(DestroyRef);
  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      this.updateProgress();
    });

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId !== undefined) {
        clearTimeout(this.timeoutId);
      }
    });
  }

  updateProgress(): void {
    const previousStep = this.currentStep() > 0 ? this.currentStep() - 1 : 0;
    const previousProgress = (previousStep / this.totalSteps()) * 100;
    this.progress.set(Math.round(previousProgress));

    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }
    const progress = (this.currentStep() / this.totalSteps()) * 100;
    this.timeoutId = setTimeout(() => {
      this.progress.set(Math.round(progress));
    }, this.animationDuration());
  }
}
