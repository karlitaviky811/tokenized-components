import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FooterFlowStore {
  readonly totalSteps = signal(1);
  readonly currentStep = signal(1);

  setTotalSteps(total: number): void {
    this.totalSteps.set(Math.max(1, total));
    if (this.currentStep() > this.totalSteps()) {
      this.currentStep.set(this.totalSteps());
    }
  }

  reset(): void {
    this.currentStep.set(1);
  }

  advance(): void {
    if (this.currentStep() < this.totalSteps()) {
      this.currentStep.update((step) => step + 1);
    }
  }

  retreat(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }
}
