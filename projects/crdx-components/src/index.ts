export * from './lib/lib-ui/lib-ui';
export * from './lib/icons/register-icons';

// Core data display/navigation.
export * from './lib/components/shared-table/shared-table.component';
export * from './lib/components/breadcrumb/breadcrumb.component';
export * from './lib/components/sidebar/sidebar';
export * from './lib/components/header/header';

// Inputs and selections.
export * from './lib/components/form-field/text-field';
export * from './lib/components/form-field/select-field';
export * from './lib/components/list-item/list-item';
export * from './lib/components/checkbox/checkbox';
export * from './lib/components/checkbox/checkbox-showcase.component';

/**
 * @deprecated Prefer `lib-select-field` for new implementations.
 * Kept for compatibility during migration window.
 */
export * from './lib/components/menu/menu';

// Actions and affordances.
export * from './lib/components/button/button';
export * from './lib/components/icon-button/icon-button';
export * from './lib/components/slide-toggle/slide-toggle';
export * from './lib/components/circular-progress-stepper/circular-progress-stepper';
export * from './lib/components/spinner/spinner';
export * from './lib/components/divider/divider';
export * from './lib/components/tooltip/tooltip';
export * from './lib/components/card/card';
export * from './lib/components/chip/chip';

// Dialogs and modal containers.
export * from './lib/components/dialogs/confirm-modal/confirm-modal';
export * from './lib/components/dialogs/confirm-modal/confirm-modal.store';
export * from './lib/components/dialogs/side-modal/side-modal';
export * from './lib/components/dialogs/side-modal/side-modal.state';

// Footer layouts.
export * from './lib/components/footer-actions/page-footer-actions/page-footer-actions';
export * from './lib/components/footer-actions/modal-footer-actions/modal-footer-actions';
export * from './lib/components/footer-actions/footer/footer';
export * from './lib/components/footer-actions/footer/footer-flow.store';

export const LIB_UI_STYLES_PATH = './lib/styles/index.scss';
