
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
    'index.csr.html': {size: 11024, hash: '288d6dfa28a80c2aa8ade8a858fb1ddfdf9e7076c3bdd30151239daa0bf809f6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1318, hash: 'f1e593f51fdb652fed9674a5a4e298d48dd9d7a75d2197d7828cbae6b0e9c060', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNNFEVIC.css': {size: 568261, hash: 'lPBOPPe+qD4', text: () => import('./assets-chunks/styles-QNNFEVIC_css.mjs').then(m => m.default)}
  },
};
