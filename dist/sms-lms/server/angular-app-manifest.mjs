
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/apexcharts/dist/apexcharts.esm.js": [
    "chunk-32KWT6XQ.js"
  ],
  "src/app/components/home/home.module.ts": [
    "chunk-L5TIME4C.js"
  ]
},
  assets: {
    'index.csr.html': {size: 11024, hash: 'b3a1a6211d2f3dd8a3a4d1ff1e0c6eda5851fda3b82130b60beac03c8b5451ef', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1318, hash: '294fb5f65118023366cc7256b6a76f55a5313edad84b6b24465b31f641f831d3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNNFEVIC.css': {size: 568261, hash: 'lPBOPPe+qD4', text: () => import('./assets-chunks/styles-QNNFEVIC_css.mjs').then(m => m.default)}
  },
};
