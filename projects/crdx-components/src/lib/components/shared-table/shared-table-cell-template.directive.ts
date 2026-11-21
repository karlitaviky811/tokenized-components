import { Directive, TemplateRef, computed, inject, input } from '@angular/core';

@Directive({
  selector: 'ng-template[cellTemplate], ng-template[libCellTemplate]',
  standalone: true,
})
export class SharedTableCellTemplateDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  cellTemplate = input<string>('');
  libCellTemplate = input<string>('', { alias: 'libCellTemplate' });
  key = computed(() => this.libCellTemplate() || this.cellTemplate());
}
