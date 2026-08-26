import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  effect,
  input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements AfterContentInit, AfterViewInit, OnDestroy {
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
  @Output() rowClick = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @ContentChildren(SharedTableCellTemplateDirective, { descendants: true })
  cellTemplatesQuery!: QueryList<SharedTableCellTemplateDirective>;
  cellTemplates: Record<string, SharedTableCellTemplateDirective['template']> = {};
  private removeScrollSync: (() => void) | null = null;
  private _paginator?: MatPaginator;
  private readonly destroyRef = inject(DestroyRef);

  readonly dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  constructor() {
    effect(() => {
      const columns = this.columns();
      this.displayedColumns = columns.map((column) => String(column.key));
    });

    effect(() => {
      const rows = this.data();
      this.dataSource.data = rows.slice();
    });
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    this._paginator = paginator;
    // En modo server-side (totalElements definido) NO conectamos al dataSource
    // para que Material no intente paginar los datos localmente
    if (this.totalElements() === undefined) {
      this.dataSource.paginator = paginator ?? null;
    }
  }

  @ViewChild('headerWrap') headerWrapRef?: ElementRef<HTMLDivElement>;
  @ViewChild('bodyWrap') bodyWrapRef?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const header = this.headerWrapRef?.nativeElement;
    const body = this.bodyWrapRef?.nativeElement;
    if (header && body) {
      const onScroll = () => { header.scrollLeft = body.scrollLeft; };
      body.addEventListener('scroll', onScroll);
      this.removeScrollSync = () => body.removeEventListener('scroll', onScroll);
    }

    // Modo server-side: escuchar eventos del paginator y emitirlos hacia arriba
    if (this._paginator && this.totalElements() !== undefined) {
      this._paginator.page.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: PageEvent) => {
        this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
      });
    }
  }

  ngAfterContentInit(): void {
    const rebuildTemplateMap = () => {
      const map: Record<string, SharedTableCellTemplateDirective['template']> = {};
      this.cellTemplatesQuery.forEach((entry) => {
        if (entry.key) {
          map[entry.key] = entry.template;
        }
      });
      this.cellTemplates = map;
    };

    rebuildTemplateMap();
    this.cellTemplatesQuery.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => rebuildTemplateMap());
  }

  ngOnDestroy(): void {
    this.removeScrollSync?.();
    this.removeScrollSync = null;
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

  columnTrackBy = (_: number, column: SharedTableColumn<T>) => column.key;

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
