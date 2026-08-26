import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-tabs-page',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './tabs.page.html',
})
export class TabsPage {}