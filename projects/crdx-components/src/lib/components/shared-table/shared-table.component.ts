import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  contentChildren,
  effect,
  input,
  output,
  signal,
  viewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatNoDataRow } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SharedTableCellTemplateDirective } from './shared-table-cell-template.directive';

export interface TablePageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface SharedTableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  key:  string;
  header: string;
  align?: 'start' | 'center' | 'end';
  width?: string;
  cell?: (row: T, index: number) => unknown;
}

@Component({
  selector: 'lib-shared-table, shared-table',
  standalone: true,
  imports: [NgTemplateOutlet, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatNoDataRow, MatPaginator, MatProgressSpinner],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.lib-table--clickable-rows]': 'enableRowClick()' },
})
export class SharedTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly columns = input.required<ReadonlyArray<SharedTableColumn<T>>>();
  readonly data = input.required<ReadonlyArray<T>>();
  readonly caption = input<string | undefined>();
  readonly emptyState = input('Sin registros disponibles');
  readonly loading = input(false);
  readonly showPaginator = input(true);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input<ReadonlyArray<number>>([5, 10, 20]);
  readonly enableRowClick = input(false);
  readonly totalElements = input<number | undefined>();
  readonly height = input<string | undefined>();
  readonly minHeight = input<string | undefined>();
  readonly maxHeight = input<string | undefined>();
  readonly rowClick = output<T>();
  readonly pageChange = output<TablePageEvent>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly _el = inject(ElementRef<HTMLElement>);

  readonly dataSource = new MatTableDataSource<T>();
  readonly cellTemplatesQuery = contentChildren(SharedTableCellTemplateDirective, { descendants: true });
  readonly headerWrapRef = viewChild<ElementRef<HTMLDivElement>>('headerWrap');
  readonly bodyWrapRef = viewChild<ElementRef<HTMLDivElement>>('bodyWrap');
  readonly _paginatorRef = viewChild(MatPaginator);
  readonly displayedColumns = signal<string[]>([]);
  readonly cellTemplates = signal<Record<string, SharedTableCellTemplateDirective['template']>>({});
  private paginatorSub?: Subscription;

  constructor() {
    effect(() => {
      this.displayedColumns.set(this.columns().map((c) => String(c.key)));
    });

    effect(() => {
      this.dataSource.data = this.data().slice();
    });

    effect(() => {
      const el = this._el.nativeElement;
      el.style.setProperty('--_lib-table-height',     this.height()    ?? '');
      el.style.setProperty('--_lib-table-min-height', this.minHeight() ?? '');
      el.style.setProperty('--_lib-table-max-height', this.maxHeight() ?? '');
    });

    effect(() => {
      const map: Record<string, SharedTableCellTemplateDirective['template']> = {};
      this.cellTemplatesQuery().forEach((entry) => {
        const key = entry.key();
        if (key) map[key] = entry.template;
      });
      this.cellTemplates.set(map);
    });

    effect(() => {
      const paginator = this._paginatorRef();
      const isServerSide = this.totalElements() !== undefined;

      this.paginatorSub?.unsubscribe();
      this.paginatorSub = undefined;

      if (isServerSide) {
        if (paginator) {
          this.paginatorSub = paginator.page.subscribe((event: PageEvent) => {
            this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
          });
        }
      } else {
        this.dataSource.paginator = paginator ?? null;
      }
    });

    afterNextRender(() => {
      const header = this.headerWrapRef()?.nativeElement;
      const body   = this.bodyWrapRef()?.nativeElement;
      if (header && body) {
        const onScroll = () => { header.scrollLeft = body.scrollLeft; };
        body.addEventListener('scroll', onScroll);
        this.destroyRef.onDestroy(() => body.removeEventListener('scroll', onScroll));
      }
      this.destroyRef.onDestroy(() => this.paginatorSub?.unsubscribe());
    });
  }

  getCellValue(column: SharedTableColumn<T>, row: T, index: number): unknown {
    if (column.cell) {
      return column.cell(row, index);
    }

    const key = column.key as keyof T;
    const fallbackKey = column.key as keyof typeof row;
    return (row?.[key] ?? row?.[fallbackKey]) ?? '';
  }

  columnId(column: SharedTableColumn<T>): string {
    return String(column.key);
  }

  resolveTextAlign(column: SharedTableColumn<T>): 'start' | 'center' | 'end' {
    return column.align ?? 'start';
  }

  resolveWidth(column: SharedTableColumn<T>): string | null {
    return column.width ?? null;
  }

  shouldRenderPaginator(): boolean {
    return this.showPaginator();
  }

  onRowClick(event: MouseEvent, row: T): void {
    if (!this.enableRowClick()) return;

    const el = event.target as HTMLElement | null;
    // Evita abrir el side modal si el click fue sobre un elemento interactivo (acciones dentro de la fila)
    if (el?.closest('button, a, input, textarea, select, [role="button"], mat-icon, mat-slide-toggle, mat-checkbox')) {
      return;
    }

    this.rowClick.emit(row);
  }
}

export { SharedTableCellTemplateDirective } from './shared-table-cell-template.directive';
