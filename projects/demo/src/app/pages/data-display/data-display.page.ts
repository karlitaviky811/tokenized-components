import { Component } from '@angular/core';
import { LibCardComponent, LibIconButtonComponent, SharedBreadcrumbComponent, SharedTableComponent, SharedTableCellTemplateDirective } from 'crdx-components';
import type { SharedTableColumn } from 'crdx-components';

interface User { name: string; email: string; role: string; status: string; [key: string]: unknown; }

@Component({
  selector: 'app-data-display-page',
  standalone: true,
  imports: [LibCardComponent, LibIconButtonComponent, SharedBreadcrumbComponent, SharedTableComponent, SharedTableCellTemplateDirective],
  templateUrl: './data-display.page.html',
})
export class DataDisplayPage {
  tableColumns: SharedTableColumn<User>[] = [
    { key: 'name', header: 'Nombre', width: '180px' },
    { key: 'email', header: 'Correo', width: '250px' },
    { key: 'role', header: 'Rol' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];

  tableData: User[] = [
    { name: 'Ana García', email: 'ana@credix.co', role: 'Admin', status: 'Activo' },
    { name: 'Carlos López', email: 'carlos@credix.co', role: 'Operador', status: 'Activo' },
    { name: 'María Ruiz', email: 'maria@credix.co', role: 'Viewer', status: 'Inactivo' },
    { name: 'Pedro Martínez', email: 'pedro@credix.co', role: 'Operador', status: 'Activo' },
    { name: 'Laura Díaz', email: 'laura@credix.co', role: 'Admin', status: 'Activo' },
  ];

  onRowClick(row: User): void {
    console.log('Row clicked:', row);
  }
}