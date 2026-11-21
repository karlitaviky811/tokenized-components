---
title: "Biblioteca Angular: contratos públicos, SSR y estados interactivos"
scope: "file"
path:
  - "projects/crdx-components/src/**/*.ts"
  - "projects/crdx-components/src/**/*.html"
  - "projects/crdx-components/src/**/*.css"
  - "projects/crdx-components/src/**/*.scss"
severity_min: "medium"
enabled: true
---

## Instructions
Revisa los cambios de la biblioteca `crdx-components` buscando regresiones funcionales, de SSR y de contrato público. Reporta solamente problemas concretos y accionables, con la ruta y el comportamiento que puede romperse.

### Contratos públicos de componentes
- Cuando cambien selectores, `input()`, `output()`, tipos exportados, tokens CSS públicos o propiedades de componentes, verifica compatibilidad hacia atrás.
- Un cambio incompatible debe estar explícitamente justificado en el PR y acompañado por una ruta de migración o una corrección de los consumidores del workspace.
- No reportes preferencias de estilo ni cambios internos que no alteren el contrato público.

### Límites SSR y navegador
- No se deben usar `window`, `document`, `localStorage`, `sessionStorage`, `navigator`, `matchMedia` o APIs DOM al cargar módulos, inicializar campos o renderizar componentes sin una guarda compatible con SSR.
- Cuando una interacción requiera navegador, exige una comprobación de plataforma y un fallback seguro para el render del servidor.
- Señala discrepancias que puedan provocar errores de hidratación, HTML distinto entre servidor y cliente, o acceso a DOM inexistente.

### Estados visuales e interacción
- Cuando un cambio afecte CSS, estados de interacción, accesibilidad, forma, tamaño, `disabled`, focus, hover, pressed o ripple, confirma que conserva los estados existentes y que tiene cobertura de Storybook, Playwright o una prueba enfocada cuando la regresión no sea evidente por inspección.
- Da prioridad a los extremos de la API pública: tamaños mínimo y máximo, variantes visuales y estado `disabled`.
- No exijas tests superficiales. Solicita verificación solo cuando el cambio modifique un comportamiento observable o una cascada CSS crítica.

## Examples

### Bad example
```typescript
// Se ejecuta también durante SSR y falla porque window no existe.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Good example
```typescript
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

const platformId = inject(PLATFORM_ID);
const prefersReducedMotion = isPlatformBrowser(platformId)
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Bad example
```typescript
// Rompe consumidores que usaban el selector anterior sin migración.
@Component({ selector: 'crdx-icon-action' })
export class IconButtonComponent {}
```

### Good example
```typescript
// El cambio de selector se documenta como incompatible y actualiza consumidores.
@Component({ selector: 'crdx-icon-action' })
export class IconButtonComponent {}
```

### Bad example
```css
/* Cambia el estado pressed sin verificar disabled ni el ripple de Material. */
.lib-icon-btn--pressed {
  border-radius: 0;
}
```

### Good example
```css
/* El estado mantiene el límite disabled y propaga el token al ripple. */
.lib-icon-btn.lib-icon-btn--pressed:not([disabled]) {
  --mat-icon-button-container-shape: var(--lib-icon-btn-pressed-radius);
}
```
