
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
    "chunk-N4Z7XLD2.js"
  ]
},
  assets: {
    'index.csr.html': {size: 11024, hash: '8108fac2efdd3f69c50d73f8ada554e3831bdb51672198054f396fd5af188cf6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1318, hash: '21993a938436aa028e2ddf47fe72eedb407c4cde5895cefa539ac12f2afd3c0e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNNFEVIC.css': {size: 568261, hash: 'lPBOPPe+qD4', text: () => import('./assets-chunks/styles-QNNFEVIC_css.mjs').then(m => m.default)}
  },
};
