
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
    'index.csr.html': {size: 11024, hash: 'cce7db4878e24a4c5f4ecbca5038c2c477d1786174c72a3d5b52d476fbc70a05', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1318, hash: 'a8905c3376d2b00194a44bb1658cabd803dc6eca785b592cccd74d70060ce65f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNNFEVIC.css': {size: 568261, hash: 'lPBOPPe+qD4', text: () => import('./assets-chunks/styles-QNNFEVIC_css.mjs').then(m => m.default)}
  },
};
