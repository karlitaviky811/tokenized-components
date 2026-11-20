/**
 * Utilidad de documentación (solo Storybook — excluida del build de la librería).
 *
 * Extrae del CSS crudo de un componente los **design tokens que consume**: los
 * custom properties referenciados vía `var(--token)` que NO están definidos en
 * el propio archivo. Esto deja fuera el plumbing local (`--lib-*`) y los tokens
 * que el componente setea para cablear Material (`--mat-*: ...`), y deja justo
 * los tokens del Design System que lee de afuera.
 *
 * Al derivarse del CSS en build-time, la lista NO se desactualiza: si el CSS
 * cambia, la doc cambia sola.
 */
export function consumedTokens(css: string): string[] {
  const referenced = new Set<string>();
  const defined = new Set<string>();

  // Referenciados: cada `var(--token` (incluye los anidados en fallbacks).
  for (const match of css.matchAll(/var\(\s*(--[\w-]+)/g)) {
    referenced.add(match[1]);
  }

  // Definidos: declaraciones `--token:` (al inicio de regla o tras `;`/`{`).
  for (const match of css.matchAll(/(?:^|[;{])\s*(--[\w-]+)\s*:/gm)) {
    defined.add(match[1]);
  }

  return [...referenced].filter((token) => !defined.has(token)).sort();
}

type TokenCategory = 'Color' | 'Tipografía' | 'Forma' | 'Tamaño y espaciado' | 'Otros';

const CATEGORY_ORDER: readonly TokenCategory[] = [
  'Color',
  'Tipografía',
  'Forma',
  'Tamaño y espaciado',
  'Otros',
];

/**
 * Clasifica un token por su nombre. El orden importa: un `...label-text-size` es
 * tipografía (tamaño de fuente), no "tamaño"; por eso Tipografía se evalúa antes
 * que Tamaño. Color gana primero porque todo token de color trae `color` en el nombre.
 */
function categorize(token: string): TokenCategory {
  if (/color/.test(token)) return 'Color';
  if (/font|text|line-height|tracking|weight|typescale|letter-spacing/.test(token)) return 'Tipografía';
  if (/shape|radius|morph/.test(token)) return 'Forma';
  if (/size|height|width|space|thickness|offset|outline|elevation/.test(token)) return 'Tamaño y espaciado';
  return 'Otros';
}

/** Devuelve un bloque markdown listo para `parameters.docs.description.component`. */
export function tokensDoc(css: string): string {
  const tokens = consumedTokens(css);
  if (tokens.length === 0) {
    return 'Este componente no consume tokens del Design System directamente.';
  }

  const groups = new Map<TokenCategory, string[]>();
  for (const token of tokens) {
    const category = categorize(token);
    (groups.get(category) ?? groups.set(category, []).get(category)!).push(token);
  }

  const sections = CATEGORY_ORDER.filter((category) => groups.has(category)).map((category) => {
    const list = groups.get(category)!.map((token) => `- \`${token}\``).join('\n');
    return `**${category}** (${groups.get(category)!.length})\n\n${list}`;
  });

  return [
    '### Design tokens consumidos',
    '',
    `Tokens del Design System que este componente lee (\`var()\`) sin definirlos localmente — ${tokens.length} en total, agrupados por categoría. Derivado del CSS en build-time.`,
    '',
    ...sections,
  ].join('\n\n');
}
