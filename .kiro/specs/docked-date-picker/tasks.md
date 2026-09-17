# Tasks — lib-docked-date-picker

- [x] 1. Andamiaje del componente contenedor
  - Crear carpeta `components/docked-date-picker/` con `docked-date-picker.{ts,html,css}`.
  - `LibDockedDatePickerComponent` con la API pública (value, disabled, min, max, label, hint, placeholder, showClear; outputs dateChange, cleared).
  - Reutilizar `CREDIX_DATE_FORMATS` + provider `MAT_DATE_FORMATS`. Copiar patrón de `lib-date-picker`.
  - _Requirements: 1, 7_

- [x] 2. Header custom con navegación dual (vista Day)
  - Crear `docked-date-picker-header.{ts,html,css}`, inyectando `MatCalendar` + `DateAdapter`.
  - Header dual `< Aug >` / `< 2025 >`, flechas mutan `activeDate`, labels reactivas a `stateChanges`.
  - Señal `view` ('day'|'month'|'year'); en 'day' se ve la grilla de Material.
  - _Requirements: 2, 5_

- [x] 3. Vista Month como lista vertical scrolleable
  - `months = computed()` → 12 filas, focused = mes de activeDate, disabled por min/max.
  - `<ul role="listbox" class="ddp-list app-scrollbar-figma">` con check + resaltado en foco.
  - Click en mes → set activeDate + view='day'. Scroll automático al item en foco.
  - _Requirements: 3, 8_

- [x] 4. Vista Year como lista vertical scrolleable
  - `years = computed()` → rango [min..max] o [actual-100 .. actual+10]; focused = año de activeDate.
  - `<ul>` análoga a Month. Click en año → set activeDate + view='month'. Scroll al foco.
  - _Requirements: 4, 8_

- [x] 5. Acciones y ocultar grilla en vistas de lista
  - `mat-datepicker-actions`: Clear / Cancel / OK con tokens del design system.
  - CSS scopeado por `panelClass` para ocultar `.mat-calendar-content` cuando view != 'day'.
  - OK confirma → dateChange; Clear vacía → cleared; Cancel no altera.
  - _Requirements: 6, 8_

- [x] 6. Accesibilidad de las listas
  - Roving tabindex, flechas ↑/↓, Home/End, Enter/Space selecciona, Esc vuelve a Day.
  - `aria-selected` en item en foco; `aria-label` en el listbox.
  - _Requirements: 3, 4_

- [x] 7. Export y demo
  - Exportar `LibDockedDatePickerComponent` en `src/index.ts`.
  - Agregar ejemplo en la página demo del date picker (`.ts` + `.html`).
  - _Requirements: 7_

- [x] 8. Verificación
  - `ng build crdx-components` sin errores; `getDiagnostics` limpio en los archivos nuevos.
  - Comparación visual contra Figma 273:6136 (Day/Month/Year) en la demo.
  - _Requirements: all_

- [ ]* 9. (Opcional) Infraestructura de tests + unit tests
  - El workspace NO tiene test runner configurado. Requiere instalar/configurar uno (Karma/Jest) — decisión del usuario.
  - Si se aprueba: unit tests de months()/years(), transiciones de vista, OK/Cancel/Clear, disabled, min/max.
  - _Requirements: 2, 3, 4, 6_
