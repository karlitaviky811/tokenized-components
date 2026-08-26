import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatDividerModule],
  templateUrl: './menu.page.html',
})
export class MenuPage {}