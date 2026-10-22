import extractorSvelte from '@unocss/extractor-svelte';
import { defineConfig } from 'unocss';

export default defineConfig({
  extractors: [extractorSvelte()],
  rules: [
    [
      /^btn-([\.\d]+)$/,
      function* ([, shade], { symbols }) {
        yield {
          background: `var(--bg-${shade})`,
          outline: 'none !important'
        };
        yield {
          [symbols.selector]: (selector) => `${selector}:hover`,
          background: `var(--bg-${shade == '50' ? 200 : parseInt(shade, 10) + 100})`
        };
      }
    ]
  ]
});
