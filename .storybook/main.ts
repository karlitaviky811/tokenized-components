import type { StorybookConfig } from '@storybook/angular-vite';

const config: StorybookConfig = {
  stories: ['../projects/crdx-components/src/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular-vite',
    options: {},
  },
};

export default config;
