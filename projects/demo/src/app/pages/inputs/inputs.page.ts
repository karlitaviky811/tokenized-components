import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LibTextFieldComponent, LibSelectFieldComponent, LibCheckboxComponent, LibRadioButtonComponent } from 'crdx-components';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-inputs-page',
  standalone: true,
  imports: [ReactiveFormsModule, LibTextFieldComponent, LibSelectFieldComponent, LibCheckboxComponent, LibRadioButtonComponent, MatRadioModule],
  template: `
    <article class="doc-page">
      <!-- TEXT FIELD -->
      <section class="doc-section">
        <h2>TextField <code>lib-text-field</code></h2>
        <p>Campo de texto con soporte de Material Form Field, íconos, errores y hints.</p>

        <h3>Inputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>label</td><td>string</td><td><em>required</em></td><td>Label del campo</td></tr>
          <tr><td>control</td><td>FormControl</td><td><em>required</em></td><td>FormControl reactivo</td></tr>
          <tr><td>appearance</td><td>'outline' | 'filled'</td><td>'outline'</td><td>Estilo visual</td></tr>
          <tr><td>placeholder</td><td>string</td><td>''</td><td>Placeholder</td></tr>
          <tr><td>type</td><td>string</td><td>'text'</td><td>Tipo de input HTML</td></tr>
          <tr><td>error</td><td>string | null</td><td>null</td><td>Mensaje de error</td></tr>
          <tr><td>hint</td><td>string</td><td>''</td><td>Texto de ayuda</td></tr>
          <tr><td>suffixIcon</td><td>string</td><td>''</td><td>Ícono suffix</td></tr>
          <tr><td>prefixIcon</td><td>string</td><td>''</td><td>Ícono prefix</td></tr>
          <tr><td>fullWidth</td><td>boolean</td><td>false</td><td>100% del ancho</td></tr>
          <tr><td>width</td><td>string | null</td><td>null</td><td>Ancho personalizado</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>false</td><td>Estado deshabilitado</td></tr>
        </table>

        <h3>Variantes</h3>
        <div class="variant-row">
          <lib-text-field label="Outline" [control]="nameCtrl" appearance="outline" placeholder="Escribe aquí..." />
          <lib-text-field label="Filled" [control]="emailCtrl" appearance="filled" placeholder="correo@..." />
        </div>
        <div class="variant-row">
          <lib-text-field label="Con error" [control]="errorCtrl" error="Campo requerido" />
          <lib-text-field label="Con hint" [control]="hintCtrl" hint="Máximo 50 caracteres" />
          <lib-text-field label="Disabled" [control]="disabledCtrl" [disabled]="true" />
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-text-field
  label="Email"
  [control]="emailControl"
  appearance="outline"
  placeholder="usuario&#64;dominio.com"
  [fullWidth]="true"
/&gt;</code></pre>
      </section>

      <!-- SELECT FIELD -->
      <section class="doc-section">
        <h2>SelectField <code>lib-select-field</code></h2>
        <p>Selector con soporte de modo single/multiple, filtrado y virtual scroll.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>label</td><td>string</td><td>''</td><td>Label del campo</td></tr>
          <tr><td>options</td><td>LibSelectOption[]</td><td>[]</td><td>Opciones disponibles</td></tr>
          <tr><td>mode</td><td>'single' | 'multiple'</td><td>'single'</td><td>Modo de selección</td></tr>
          <tr><td>filterable</td><td>boolean</td><td>true</td><td>Permite filtrar opciones</td></tr>
          <tr><td>appearance</td><td>'outline' | 'filled'</td><td>'outline'</td><td>Estilo visual</td></tr>
          <tr><td>placeholder</td><td>string</td><td>'Elegir opción'</td><td>Placeholder</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>false</td><td>Deshabilitado</td></tr>
          <tr><td>required</td><td>boolean</td><td>false</td><td>Requerido</td></tr>
          <tr><td>width</td><td>string | number | null</td><td>null</td><td>Ancho personalizado</td></tr>
          <tr><td>selectAllLabel</td><td>string</td><td>'Seleccionar todos'</td><td>Label del select all (multiple)</td></tr>
          <tr><th>Output</th><th>Tipo</th><th></th><th>Descripción</th></tr>
          <tr><td>valueChange</td><td>T | T[]</td><td></td><td>Emite al cambiar selección</td></tr>
        </table>

        <h3>Variantes</h3>
        <div class="variant-row">
          <lib-select-field label="Single" [options]="selectOptions" mode="single" />
          <lib-select-field label="Multiple" [options]="selectOptions" mode="multiple" />
        </div>
        <div class="variant-row">
          <lib-select-field label="Sin filtro" [options]="selectOptions" [filterable]="false" />
          <lib-select-field label="Disabled" [options]="selectOptions" [disabled]="true" />
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-select-field
  label="País"
  [options]="countries"
  mode="single"
  (valueChange)="onCountryChange($event)"
/&gt;</code></pre>
      </section>

      <!-- CHECKBOX -->
      <section class="doc-section">
        <h2>Checkbox <code>lib-checkbox</code></h2>
        <p>Checkbox con soporte de estados indeterminate y error.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>checked</td><td>boolean</td><td>false</td><td>Estado marcado</td></tr>
          <tr><td>indeterminate</td><td>boolean</td><td>false</td><td>Estado indeterminado</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>false</td><td>Deshabilitado</td></tr>
          <tr><td>error</td><td>boolean</td><td>false</td><td>Muestra estado de error</td></tr>
        </table>

        <h3>Variantes</h3>
        <div class="variant-row">
          <lib-checkbox>Default</lib-checkbox>
          <lib-checkbox [checked]="true">Checked</lib-checkbox>
          <lib-checkbox [indeterminate]="true">Indeterminate</lib-checkbox>
          <lib-checkbox [disabled]="true">Disabled</lib-checkbox>
          <lib-checkbox [error]="true">Error</lib-checkbox>
        </div>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;lib-checkbox
  [checked]="accepted()"
  (checkedChange)="onAccept($event)"
&gt;Acepto los términos&lt;/lib-checkbox&gt;</code></pre>
      </section>

      <!-- RADIO BUTTON -->
      <section class="doc-section">
        <h2>RadioButton <code>lib-radio-button</code></h2>
        <p>Radio button de Material 3. Se agrupa con <code>mat-radio-group</code> para selección exclusiva.</p>

        <h3>Inputs / Outputs</h3>
        <table class="api-table">
          <tr><th>Input</th><th>Tipo</th><th>Default</th><th>Descripción</th></tr>
          <tr><td>value</td><td>unknown</td><td>null</td><td>Valor que representa este radio</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>false</td><td>Estado deshabilitado</td></tr>
          <tr><td>checked</td><td>boolean</td><td>false</td><td>Seleccionado (uso sin grupo)</td></tr>
          <tr><th>Output</th><th>Tipo</th><th></th><th>Descripción</th></tr>
          <tr><td>checkedChange</td><td>unknown</td><td></td><td>Emite el value al seleccionar</td></tr>
        </table>

        <h3>Estados</h3>
        <div class="variant-row">
          <lib-radio-button value="a" [checked]="false">Unselected</lib-radio-button>
          <lib-radio-button value="b" [checked]="true">Selected</lib-radio-button>
          <lib-radio-button value="c" [disabled]="true">Disabled</lib-radio-button>
          <lib-radio-button value="d" [disabled]="true" [checked]="true">Disabled selected</lib-radio-button>
        </div>

        <h3>Grupo interactivo</h3>
        <mat-radio-group [value]="selectedCard()" (change)="selectedCard.set($event.value)" class="radio-group">
          <lib-radio-button value="classic">Tarjeta Clásica</lib-radio-button>
          <lib-radio-button value="gold">Tarjeta Gold</lib-radio-button>
          <lib-radio-button value="platinum">Tarjeta Platinum</lib-radio-button>
        </mat-radio-group>
        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #555;">
          Seleccionada: <strong>{{ selectedCard() }}</strong>
        </p>

        <h3>Ejemplo de uso</h3>
        <pre><code>&lt;mat-radio-group [(ngModel)]="plan"&gt;
  &lt;lib-radio-button value="basic"&gt;Plan Básico&lt;/lib-radio-button&gt;
  &lt;lib-radio-button value="pro"&gt;Plan Pro&lt;/lib-radio-button&gt;
&lt;/mat-radio-group&gt;</code></pre>
      </section>
    </article>
  `,
  styles: [`
    .radio-group { display: flex; flex-direction: column; gap: 0.25rem; }
  `],
})
export class InputsPage {
  nameCtrl = new FormControl('');
  emailCtrl = new FormControl('');
  errorCtrl = new FormControl('');
  hintCtrl = new FormControl('');
  disabledCtrl = new FormControl('');
  selectedCard = signal('classic');
  selectOptions = [
    { value: 'co', label: 'Colombia' },
    { value: 'mx', label: 'México' },
    { value: 'ar', label: 'Argentina' },
    { value: 'pe', label: 'Perú' },
  ];
}
