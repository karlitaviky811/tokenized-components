import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

/**
 * Base class for components that wrap Angular Material primitives which are
 * not hydration-safe (chips, selects, form fields, date pickers, etc.).
 *
 * Opt-in and non-breaking:
 *   - Default `skipHydration = false` → identical behavior to before. Apps that
 *     don't use SSR, or don't set the input, are completely unaffected.
 *   - Set `[skipHydration]="true"` on the component (typically only in SSR apps)
 *     to add the `ngSkipHydration` attribute to the host. Angular then renders
 *     the component on the server but re-renders it on the client instead of
 *     hydrating it, avoiding the Angular Material hydration mismatch that
 *     otherwise crashes server-side rendering.
 *
 * The attribute is emitted during change detection, so it is present in the
 * serialized server HTML and read by Angular's hydration pass on the client.
 */
@Directive()
export abstract class LibHydrationSkippable {
  /** When true, adds `ngSkipHydration` to the host (opt-in, SSR only). */
  readonly skipHydration = input(false, { transform: booleanAttribute });

  @HostBinding('attr.ngSkipHydration')
  protected get ngSkipHydrationAttr(): '' | null {
    return this.skipHydration() ? '' : null;
  }
}
