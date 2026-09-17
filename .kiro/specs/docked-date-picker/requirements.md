# Requirements — lib-docked-date-picker

## Introduction

`lib-docked-date-picker` es una **nueva variante** de date picker para la librería `crdx-components`, basada en el diseño de Figma "Docked input date picker [desktop]" (node `273:6136`). Es un componente independiente: NO modifica ni reemplaza a `lib-date-picker` ni a `lib-modal-date-picker`.

La característica que lo distingue de las variantes existentes es que sus vistas de selección de **mes** y **año** son **listas verticales scrolleables** (un item por fila, con check e ítem seleccionado resaltado), en lugar de las grillas 4×N que provee Angular Material por defecto. La vista de **día** conserva la grilla de calendario tradicional.

El scrollbar de las listas debe reutilizar la utilidad global existente `.app-scrollbar-figma` (definida en `styles/scrollbar.scss`), manteniendo una única fuente de verdad para el scroll del design system.

### Decisión de diseño (contexto)
Se evaluaron dos enfoques:
- **A**: grillas nativas de Material con estilos → descartada por no ser fiel al Figma.
- **B**: listas verticales scrolleables custom → **elegida**, fidelidad total al diseño.

Costo asumido: reconstruir las vistas month/year implica manejar la navegación entre vistas y reimplementar la accesibilidad de esas listas manualmente.

---

## Glosario

- **Vista Day**: calendario mensual en grilla (semana × días), como el datepicker actual.
- **Vista Month**: lista vertical de los 12 meses del año en foco.
- **Vista Year**: lista vertical de años (rango navegable) alrededor del año en foco.
- **Año en foco / Mes en foco**: el período que el usuario está navegando, no necesariamente el seleccionado.
- **Valor seleccionado**: la fecha efectivamente elegida por el usuario y confirmada.

---

## Requirements

### Requirement 1 — Campo de entrada (input) con calendario docked

**User Story:** Como usuario, quiero un campo de texto con label, hint e ícono, que al activarse despliegue el calendario anclado debajo, para elegir una fecha sin abrir un modal.

#### Acceptance Criteria
1. WHEN el componente se renderiza THEN muestra un `mat-form-field` outlined con `label`, un `input` de fecha, un ícono de calendario como sufijo y un `hint` con el formato de fecha.
2. WHEN el usuario hace click en el ícono de calendario THEN el panel del calendario se despliega anclado (docked) debajo del input.
3. WHEN hay un valor seleccionado THEN el input muestra la fecha en formato `DD/MM/YYYY`.
4. WHEN el input no tiene valor THEN muestra el placeholder `DD/MM/YYYY`.
5. WHEN el componente recibe `disabled = true` THEN el input y el toggle quedan deshabilitados y no abren el panel.
6. IF `showClear = true` AND hay un valor THEN se muestra un ícono de limpiar (X) en el sufijo del input que, al activarse, borra el valor.

### Requirement 2 — Vista Day (calendario en grilla)

**User Story:** Como usuario, quiero ver el mes en una grilla de días para elegir una fecha concreta.

#### Acceptance Criteria
1. WHEN el panel abre THEN la vista inicial es Day, mostrando el mes del valor seleccionado, o el mes actual si no hay valor.
2. WHEN se muestra la grilla THEN presenta encabezados de días de la semana y las celdas de fechas del mes en foco.
3. WHEN el usuario hace click en un día THEN ese día queda marcado como seleccionado con el color primario del design system.
4. WHEN un día corresponde a la fecha de hoy THEN se resalta con el estilo "today".
5. WHEN una fecha está fuera de `[min, max]` THEN se muestra deshabilitada y no es seleccionable.
6. WHEN el header muestra la navegación de mes (`< Aug >`) THEN las flechas cambian el mes en foco sin cambiar de vista.

### Requirement 3 — Vista Month (lista vertical scrolleable)

**User Story:** Como usuario, quiero seleccionar el mes desde una lista vertical desplazable, tal como el diseño de Figma.

#### Acceptance Criteria
1. WHEN el usuario activa el selector de mes en el header THEN la vista cambia a Month.
2. WHEN se muestra la vista Month THEN lista los 12 meses del año en foco, uno por fila, en orden de enero a diciembre.
3. WHEN un mes es el mes en foco THEN se muestra con un check a la izquierda y fondo resaltado.
4. WHEN el usuario hace click en un mes THEN se fija ese mes en foco y la vista vuelve a Day.
5. WHEN la lista excede el alto del panel THEN es scrolleable verticalmente usando la utilidad `.app-scrollbar-figma`.
6. WHEN la vista Month abre THEN el mes en foco es visible (con scroll automático si es necesario).

### Requirement 4 — Vista Year (lista vertical scrolleable)

**User Story:** Como usuario, quiero seleccionar el año desde una lista vertical desplazable, tal como el diseño de Figma.

#### Acceptance Criteria
1. WHEN el usuario activa el selector de año en el header THEN la vista cambia a Year.
2. WHEN se muestra la vista Year THEN lista años en orden ascendente, uno por fila, dentro de un rango navegable.
3. WHEN un año es el año en foco THEN se muestra con un check a la izquierda y fondo resaltado.
4. WHEN el usuario hace click en un año THEN se fija ese año en foco y la vista pasa a Month.
5. WHEN la lista excede el alto del panel THEN es scrolleable verticalmente usando la utilidad `.app-scrollbar-figma`.
6. WHEN la vista Year abre THEN el año en foco es visible (con scroll automático si es necesario).
7. IF hay `min`/`max` de fecha THEN la lista de años se limita a ese rango.

### Requirement 5 — Header con navegación dual

**User Story:** Como usuario, quiero un header que me deje navegar mes y año por separado, y cambiar entre vistas.

#### Acceptance Criteria
1. WHEN se muestra el header THEN presenta un grupo de navegación de mes (`<` etiqueta-mes `>`) y un grupo de navegación de año (`<` etiqueta-año `>`).
2. WHEN el usuario hace click en la etiqueta de mes THEN abre la vista Month.
3. WHEN el usuario hace click en la etiqueta de año THEN abre la vista Year.
4. WHEN el usuario usa las flechas de mes THEN avanza/retrocede el mes en foco (cruzando de año si corresponde).
5. WHEN el usuario usa las flechas de año THEN avanza/retrocede el año en foco.

### Requirement 6 — Acciones del panel

**User Story:** Como usuario, quiero confirmar, cancelar o limpiar la selección desde el panel.

#### Acceptance Criteria
1. WHEN el panel está abierto THEN muestra las acciones `Cancel` y `OK`, y opcionalmente `Clear`.
2. WHEN el usuario presiona `OK` THEN se confirma la fecha en foco como valor seleccionado, se emite el cambio y se cierra el panel.
3. WHEN el usuario presiona `Cancel` THEN se cierra el panel sin alterar el valor previo.
4. IF `showClear = true` THEN se muestra `Clear`, y al presionarlo se borra el valor y se emite el evento de limpieza.
5. WHEN las acciones se renderizan THEN usan los tokens tipográficos y de color del design system (texto en color primario).

### Requirement 7 — API pública e integración con formularios

**User Story:** Como desarrollador, quiero una API consistente con las otras variantes de date picker de la librería.

#### Acceptance Criteria
1. WHEN se usa el componente THEN acepta los inputs `value`, `disabled`, `min`, `max`, `label`, `hint`, `placeholder`, `showClear`.
2. WHEN cambia el valor confirmado THEN emite un output `dateChange` con la fecha.
3. WHEN se limpia el valor THEN emite un output `cleared`.
4. WHEN se exporta THEN el componente está disponible desde el barrel público `crdx-components` (`index.ts`) como `LibDockedDatePickerComponent`.
5. WHEN se documenta THEN se agrega un ejemplo funcional en la página demo del date picker.

### Requirement 8 — Estilo fiel al design system

**User Story:** Como diseñador, quiero que el componente respete los tokens y el aspecto del Figma.

#### Acceptance Criteria
1. WHEN se renderiza cualquier vista THEN usa los tokens de color, tipografía y radios del design system (variables CSS ya existentes para date pickers).
2. WHEN se muestra el día seleccionado THEN usa el color primario (rojo) con texto en contraste, igual al Figma.
3. WHEN se muestra un item de lista seleccionado (mes/año) THEN usa fondo resaltado gris y check, igual al Figma.
4. WHEN se muestra el scrollbar de las listas THEN es el de 4px de `.app-scrollbar-figma` (no se duplican reglas `::-webkit-scrollbar`).
5. WHEN el panel se muestra THEN usa la sombra de elevación y el radio de contenedor del design system.

---

## Fuera de alcance (Out of scope)
- Selección de **rango** de fechas (solo fecha única).
- Variante **modal/touch** (ya existe `lib-modal-date-picker`).
- Modificar `lib-date-picker` o `lib-modal-date-picker`.
- Internacionalización más allá de la que ya provee `MatNativeDateModule` / locale del proyecto.

## Riesgos y consideraciones técnicas
- Reemplazar las vistas month/year de Material implica manejar la navegación de vistas manualmente; hay que cuidar la sincronización entre "período en foco" y "valor seleccionado".
- La accesibilidad por teclado de las listas verticales debe implementarse a mano (roles ARIA, foco, flechas), ya que se pierde el comportamiento nativo de las grillas de Material en esas vistas.
- El scroll automático al item seleccionado al abrir Month/Year requiere acceso al DOM del viewport tras el render.
