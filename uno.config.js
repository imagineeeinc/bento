import extractorSvelte from '@unocss/extractor-svelte'
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    extractorSvelte(),
  ],
  rules: [
    [
      /^hori-button-bar-(.+)$/,
      ([_, shade], { symbols }) => {
        let nextShade = parseInt(shade, 10) + 100;
        if (shade === 50) nextShade = 200
        return {
          [symbols.body]: `
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            gap: 3px;
            & > button {
              background: var(--bg-${shade});
              margin: 0;
              border-radius: 0;
              outline: none;
            }
            & > button:first-child {
              border-radius: 10px 0 0 10px;
            }
            & > button:last-child {
              border-radius: 0 10px 10px 0;
            }
            & > button:only-child {
              border-radius: 10px;
            }
            & > button:hover {
              background: var(--bg-${nextShade});
            }
          `
        }
      }
    ]
  ]
})