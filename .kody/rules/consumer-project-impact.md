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
Revisa cambios en exports públicos, selectores Angular, `input()`, `output()`, tipos, interfaces, tokens CSS, clases públicas, DOM observable, `peerDependencies`, versión o publicación del paquete.

Si el cambio es incompatible, el PR debe incluir:
1. Clasificación de versión semántica adecuada. Un cambio incompatible requiere una versión major o una estrategia explícita de compatibilidad.
2. Impacto separado para `mfe-sac` y `mfe-workspace`.
3. Instrucciones de migración o una alternativa compatible hacia atrás.
4. Evidencia de validación cuando el contrato pueda romper compilación, carga federada, SSR o interacción visible.

### Reglas de decisión
- Alerta si el PR presupone que `mfe-sac` recibirá cambios nuevos automáticamente: usa una versión exacta `3.1.0` y requiere una actualización explícita.
- Alerta si un cambio minor de `crdx-components` puede afectar a `mfe-workspace`: su rango `^3.1.0` puede adoptar nuevas versiones 3.x al actualizar dependencias.
- No exijas cambios en consumidores cuando el cambio sea interno, no exportado y no altere contrato, DOM, estilos públicos ni comportamiento observable.
- No inventes consumidores adicionales. Si existe incertidumbre, solicita que el PR declare los consumidores impactados y su plan de validación.

## Examples

### Bad example
```markdown
El PR elimina un export público, mantiene versión minor y no menciona consumidores.
```

### Good example
```markdown
El PR conserva un alias deprecado, documenta migración y valida consumidores afectados.
```
