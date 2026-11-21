---
title: "Impacto de consumidores de crdx-components"
scope: "pull-request"
severity_min: "high"
enabled: true
---

## Instructions
Evalúa si el Pull Request cambia un contrato público de `crdx-components` y puede afectar a los proyectos consumidores conocidos. Emite una alerta de severidad alta solo cuando exista una incompatibilidad concreta o el PR no declare y cubra su impacto en consumidores.

### Consumidores conocidos
- `mfe-sac` declara `crdx-components` con versión exacta `3.1.0`.
- `mfe-workspace` declara `crdx-components` con rango `^3.1.0`.
- La biblioteca actual declara versión `3.2.1` y sus consumidores requieren Angular 22, Angular Material 22, `@ngx-translate/core` 17, `ngx-mask` 22 y RxJS 7.

### Cambios que requieren alerta
Revisa si el PR modifica alguno de estos contratos:
- Exports públicos en `projects/crdx-components/src/index.ts` o índices de componentes.
- Selector Angular, `input()`, `output()`, tipos, interfaces o servicios públicos.
- Tokens CSS, clases públicas, estructura DOM documentada o comportamiento observable de un componente.
- `peerDependencies`, versión del paquete o configuración de publicación en `projects/crdx-components/package.json`.
- Compatibilidad SSR, Angular 22, Angular Material 22, traducciones, máscaras o RxJS.

Si el cambio es incompatible, el PR debe incluir:
1. Clasificación de versión semántica adecuada. Un cambio incompatible para consumidores requiere una versión major o una estrategia explícita de compatibilidad.
2. Impacto separado para `mfe-sac` y `mfe-workspace`.
3. Instrucciones de migración o una alternativa compatible hacia atrás.
4. Evidencia de validación en los consumidores afectados, cuando el contrato modificado pueda romper compilación, carga federada, render SSR o interacción visible.

### Reglas de decisión
- Alerta si el PR presupone que `mfe-sac` recibirá cambios nuevos automáticamente: usa una versión exacta `3.1.0` y requiere una actualización explícita.
- Alerta si un cambio minor de `crdx-components` puede afectar a `mfe-workspace`: su rango `^3.1.0` puede adoptar nuevas versiones 3.x al actualizar dependencias.
- No exijas cambios en consumidores cuando el cambio sea interno, no exportado y no altere contrato, DOM, estilos públicos ni comportamiento observable.
- No inventes consumidores adicionales. Si existe incertidumbre, solicita que el PR declare los consumidores impactados y su plan de validación.

## Examples

### Bad example
```markdown
El PR elimina el export público `IconButtonComponent`, mantiene la versión `3.2.2` y no menciona consumidores.
```

### Good example
```markdown
El PR conserva el export anterior como alias deprecado, documenta la migración y valida que `mfe-sac` y `mfe-workspace` continúan compilando con Angular 22.
```

### Bad example
```markdown
El PR modifica un token CSS público usado por los componentes sin indicar si los remotos federados requieren ajuste visual.
```

### Good example
```markdown
El PR mantiene el token anterior con fallback, documenta el nuevo token y valida los estados visuales afectados en los consumidores conocidos.
```
