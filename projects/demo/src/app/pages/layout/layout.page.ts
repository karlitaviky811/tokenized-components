import { Component } from '@angular/core';
import { LibDividerComponent, HeaderComponent, SidebarComponent } from 'crdx-components';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [LibDividerComponent, HeaderComponent, SidebarComponent],
  template: `
    <article class="doc-page">
      <!-- DIVIDER -->
      <section class="doc-section">
        <h2>Divider <code>lib-divider</code></h2>
        <p>Separador visual horizontal o vertical.</p>

        <h3>Inputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>orientation</td><td>'horizontal' | 'vertical'</td><td>'horizontal'</td><td>Dirección del divisor</td></tr>
        </table>

        <h3>Variantes</h3>
        <p>Horizontal:</p>
        <lib-divider />
        <p style="margin-top: 1rem;">Vertical (requiere contenedor con altura):</p>
        <div style="display: flex; align-items: center; height: 40px; gap: 1rem;">
          <span>Izquierda</span>
          <lib-divider orientation="vertical" />
          <span>Derecha</span>
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-divider orientation="horizontal" /&gt;</code></pre>
      </section>

      <!-- HEADER -->
      <section class="doc-section">
        <h2>Header <code>lib-header</code></h2>
        <p>Barra superior con leading icon, branding y acciones trailing.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>showLeading</td><td>boolean</td><td>true</td><td>Muestra ícono leading</td></tr>
          <tr><td>leadingIcon</td><td>string</td><td>'icon-menu'</td><td>Ícono del leading</td></tr>
          <tr><td>brandLabel</td><td>string</td><td>'Credix'</td><td>Texto de marca</td></tr>
          <tr><td>brandIcon</td><td>string</td><td>'smiley'</td><td>Ícono de marca</td></tr>
          <tr><td>trailingActions</td><td>HeaderAction[]</td><td>[search]</td><td>Acciones trailing</td></tr>
          <tr><td>iconBasePath</td><td>string</td><td>'assets/icons'</td><td>Path base de íconos</td></tr>
          <tr><th>Output</th><th>Tipo</th><th></th><th>Descripción</th></tr>
          <tr><td>leadingClick</td><td>void</td><td></td><td>Click en leading</td></tr>
          <tr><td>actionClick</td><td>HeaderAction</td><td></td><td>Click en acción trailing</td></tr>
        </table>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-header
  brandLabel="Mi App"
  [trailingActions]="[
    {{ '{' }} icon: 'notifications', ariaLabel: 'Notificaciones' {{ '}' }},
    {{ '{' }} icon: 'profile', ariaLabel: 'Perfil' {{ '}' }}
  ]"
  (leadingClick)="toggleSidebar()"
  (actionClick)="onAction($event)"
/&gt;</code></pre>
      </section>

      <!-- SIDEBAR -->
      <section class="doc-section">
        <h2>Sidebar <code>lib-sidebar</code></h2>
        <p>Barra de navegación lateral con íconos y labels opcionales.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>items</td><td>SidebarNavItem[]</td><td>[]</td><td>Items de navegación</td></tr>
          <tr><td>selectedId</td><td>string | null</td><td>null</td><td>ID del item activo</td></tr>
          <tr><td>showLabels</td><td>boolean</td><td>true</td><td>Muestra labels de texto</td></tr>
          <tr><td>spritePath</td><td>string</td><td>'assets/icons/sprite.svg'</td><td>Path del sprite SVG</td></tr>
          <tr><th>Output</th><th>Tipo</th><th></th><th>Descripción</th></tr>
          <tr><td>itemSelected</td><td>SidebarNavItem</td><td></td><td>Emite item seleccionado</td></tr>
        </table>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-sidebar
  [items]="navItems"
  [selectedId]="activeRoute()"
  (itemSelected)="navigate($event)"
/&gt;</code></pre>
      </section>
    </article>
  `,
})
export class LayoutPage {}
