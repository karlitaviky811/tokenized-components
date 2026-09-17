# Design — lib-docked-date-picker

## Overview

`lib-docked-date-picker` reutiliza el motor de calendario de Angular Material (`MatDatepicker` + `MatCalendar`) para la **vista Day** y toda la aritmética de fechas (`DateAdapter`), pero **reemplaza las vistas Month y Year** por listas verticales scrolleables custom, fieles al Figma.

La estrategia central es NO reconstruir el datepicker desde cero. Material ya resuelve: overlay docked, `min`/`max`, formatos, `activeDate`, selección, teclado en la grilla de días, y el ciclo `Cancel`/`OK` vía `mat-datepicker-actions`. Lo único que Material no ofrece es el layout de lista para mes/año. Por eso interceptamos únicamente ese fragmento.

### Decisión de arquitectura clave

Material expone tres `currentView` en `MatCalendar`: `'month'` (grilla de días), `'year'` (grilla de meses) y `'multi-year'` (grilla de años). NO permite inyectar un template propio para year/multi-year sin reemplazar el componente entero.

**Enfoque elegido:** un **header componen
**Modificados:**
- `projects/crdx-components/src/index.ts` — exportar `LibDockedDatePickerComponent`.
- `projects/demo/src/app/pages/date-picker/date-picker.page.ts` + `.html` — ejemplo demo.

**Sin cambios:** `lib-date-picker`, `lib-modal-date-picker`, `scrollbar.scss`, `_mat-datepicker-overrides.scss` (se reutilizan).
```
used`. Se propondrá como propiedad numerada en tasks solo si aplica.

### Verificación manual
- Comparación visual contra Figma `273:6136` (Day/Month/Year).
- Scroll de listas usa el thumb de 4px de `.app-scrollbar-figma`.

---

## Archivos afectados

**Nuevos** (`projects/crdx-components/src/lib/components/docked-date-picker/`):
- `docked-date-picker.ts`
- `docked-date-picker.html`
- `docked-date-picker.css`
- `docked-date-picker-header.ts`
- `docked-date-picker-header.html`
- `docked-date-picker-header.css`
cto y se acota con `min`/`max`.
- Transiciones: click etiqueta mes → Month; elegir año → Month; elegir mes → Day.
- `disabled` bloquea apertura.
- `OK` emite `dateChange`; `Clear` emite `cleared` y vacía; `Cancel` no altera valor.
- Filas fuera de `[min,max]` marcadas `disabled`.

### Property-based tests
Solo si el proyecto ya tiene infraestructura PBT (se verifica en la fase de tasks). Candidata natural: para cualquier `activeDate`, `months()` siempre devuelve 12 filas ordenadas ene→dic con exactamente una `focr`/`Space`, `Esc` vuelve a Day.
- El item en foco recibe `tabindex="0"`, el resto `-1` (roving tabindex).
- La vista Day conserva la a11y nativa de Material sin cambios.

---

## Testing Strategy

Framework: el que ya usa el proyecto (Karma/Jasmine o Jest según config de `crdx-components`; se detecta antes de escribir tests).

### Unit tests
- Render inicial: input, label, hint, ícono; vista inicial = Day.
- `months()` genera 12 filas, `focused` correcto según `activeDate`.
- `years()` respeta rango por defenulos: el calendario abre en el mes actual (Req 2.1).
- Selección fuera de `[min,max]`: filas/celdas `disabled`, no accionables (Req 2.5, 4.7).
- Locale ausente: se hereda el `DateAdapter` configurado en la app (mismo comportamiento que las variantes actuales).

---

## Accessibility

Como se reemplazan las vistas grid nativas por listas, se reimplementa a11y de esas listas:
- `<ul role="listbox">`, `<li role="option" [attr.aria-selected]>`.
- Foco navegable con flechas ↑/↓, `Home`/`End`, selección con `Entest__item`, `.ddp-list__item--focused`, `.ddp-list__check`.
- Item en foco: fondo `--Gris-200`/token gris del design system + ícono `check` a la izquierda (Figma).
- Scrollbar: clase `.app-scrollbar-figma` en el `<ul>`. **Cero reglas `::-webkit-scrollbar` propias** (fuente única, según decisión previa del proyecto).
- Ocultar la grilla de Material cuando `view !== 'day'`: regla CSS sobre `.mat-calendar-content` scopeada al panel del componente (vía `panelClass`).

---

## Error Handling

- `value`/`min`/`max` fuente de verdad).
- `MatDatepicker` (interno) — valor tentativo hasta `OK`.
- Signals del header (`view`) — solo UI.

Toda operación de fecha usa `DateAdapter` (nunca `Date` nativo directamente) para respetar locale/inmutabilidad, igual que el header existente.

---

## Styling

- Reutiliza el override global `_mat-datepicker-overrides.scss` para colores del calendario (día seleccionado rojo, today, sombra, radio). NO se duplican.
- Las listas custom viven en `docked-date-picker.css` con clases `.ddp-list`, `.ddp-li)` → `view='day'`.
- Flechas de mes/año: mutan `activeDate` sin cambiar de vista (como el header actual).

### Scroll automático al item en foco

Al entrar a Month/Year, tras el render se hace `scrollIntoView({ block: 'center' })` sobre el item `focused`, usando un `viewChild` de las filas o `ElementRef` del `<ul>`. Se ejecuta en `afterNextRender` / `queueMicrotask` para asegurar DOM presente.

---

## Data Models

Sin modelos persistentes nuevos. El estado vive en:
- `MatCalendar.activeDate` — período en foco (in`/`max`.
- `years = computed()` → rango de años. Si hay `min`/`max`, se acota a ese rango; si no, `[yearActual - 100, yearActual + 10]` (confirmado en requisitos). `focused` = año de `activeDate`.

### Transiciones de vista (flujo confirmado en requisitos)

```
Day --(click etiqueta mes)--> Month
Day --(click etiqueta año)--> Year
Year --(elige año)--> Month
Month --(elige mes)--> Day
```

- Elegir año: `activeDate = adapter.updateYear(...)` → `view='month'`.
- Elegir mes: `activeDate = adapter.updateMonth(...ndar.currentView = 'month'` (grilla días visible).
- `view = 'month'` o `'year'` → se oculta el cuerpo de la grilla de Material vía CSS y se muestra la `<ul>` custom encima.

### Modelo de fila (listas)

```typescript
interface MonthRow { index: number; label: string; focused: boolean; disabled: boolean; }
interface YearRow  { year: number;  label: string; focused: boolean; disabled: boolean; }
```

- `months = computed()` → 12 filas del año de `activeDate`, `focused` = mes de `activeDate`, `disabled` según `m
placeholder: InputSignal<string>        // = 'DD/MM/YYYY'
showClear:   InputSignal<boolean>       // = true

dateChange:  OutputEmitterRef<Date>     // valor confirmado
cleared:     OutputEmitterRef<void>     // limpieza
```

Reutiliza `CREDIX_DATE_FORMATS` y provee `MAT_DATE_FORMATS` igual que `lib-date-picker`.

### Vista activa (header)

```typescript
type DockedView = 'day' | 'month' | 'year';
readonly view = signal<DockedView>('day');
```

Regla de sincronización con Material:
- `view = 'day'`  → `calevo (listas); son responsabilidades distintas.

---

## Components and Interfaces

### API pública (`LibDockedDatePickerComponent`)

Idéntica a `LibDatePickerComponent` para intercambiabilidad:

```typescript
value:       InputSignal<Date | null>   // = null
disabled:    InputSignal<boolean>       // = false
min:         InputSignal<Date | null>   // = null
max:         InputSignal<Date | null>   // = null
label:       InputSignal<string>        // = 'Date'
hint:        InputSignal<string>        // = 'DD/MM/YYYY' Responsabilidad |
|---|---|
| `LibDockedDatePickerComponent` | Contenedor público: form-field, input, toggle, acciones, API pública (inputs/outputs). Análogo a `LibDatePickerComponent`. |
| `LibDockedDatePickerHeaderComponent` | Header + vistas custom Month/Year. Inyecta `MatCalendar` y `DateAdapter`. Controla `activeDate` y qué vista se muestra. |

> Se crean 2 componentes nuevos en `components/docked-date-picker/`. NO se reutiliza `lib-date-picker-header` para no acoplar el header existente (grid) con el nue─ mat-datepicker
│         ├── calendarHeaderComponent = LibDockedDatePickerHeaderComponent
│         └── mat-datepicker-actions      ← Clear / Cancel / OK
│
└── LibDockedDatePickerHeaderComponent (inyecta MatCalendar + DateAdapter)
    ├── header dual  ( < Aug > | < 2025 > )
    ├── vista Day    → delega en MatCalendar (currentView='month')
    ├── vista Month  → <ul.ddp-list.app-scrollbar-figma> 12 meses
    └── vista Year   → <ul.ddp-list.app-scrollbar-figma> rango de años
```

### Componentes

| Componente |
│   └─ggle             ← ícono calendario
│   ├── (opcional) botón Clear (X)        ← showClearnt)
│   ├── input[matDatepicker]              ← valor, min, max, disabled
│   ├── mat-datepicker-tona sola fuente de verdad (`MatCalendar.activeDate`) y preserva el flujo `OK`/`Cancel` nativo.

---

## Architecture

```
lib-docked-date-picker (host)
├── mat-form-field (input + label + hivuelve a mostrar la grilla de días.

Esto mantiene ua **su propia lista** (`Month` o `Year`) por encima, usando `activeDate` como fuente de verdad del período en foco.
- Al elegir un item, actualiza `activeDate` y 
Concretamente:
- La vista **Day** la sigue pintando `MatCalendar` (`currentView = 'month'`).
- Cuando el usuario abre mes o año, el header pone el calendario en un estado "oculto" y muestr sobre el área del calendario y controla `calendar.activeDate` / `calendar.currentView`.
t custom** (patrón que el repo ya usa en `lib-date-picker-header`) que, en vez de delegar a las vistas grid de Material para mes/año, **renderiza sus propias listas verticales** superpuestas