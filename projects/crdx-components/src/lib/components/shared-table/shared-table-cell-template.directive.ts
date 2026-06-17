import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[cellTemplate], ng-template[libCellTemplate]',
  standalone: true,
})
export class SharedTableCellTemplateDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  private legacyKey = '';
  private modernKey = '';

  @Input()
  set cellTemplate(value: string | null | undefined) {
    this.legacyKey = value ?? '';
  }

  @Input()
  set libCellTemplate(value: string | null | undefined) {
    this.modernKey = value ?? '';
  }

  get key(): string {
    return this.modernKey || this.legacyKey;
  }
}
