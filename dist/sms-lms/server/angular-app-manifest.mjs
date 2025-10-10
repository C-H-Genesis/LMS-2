
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
    'index.csr.html': {size: 11024, hash: '96ec1456bbb3cc5f4baadd94bf33c03cb99a868578d5c8f35b75beab943dc180', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1318, hash: 'b32dbfe13b3dd8e9618ab7429828724801d61a145282795cffb6d7de0461b4ee', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNNFEVIC.css': {size: 568261, hash: 'lPBOPPe+qD4', text: () => import('./assets-chunks/styles-QNNFEVIC_css.mjs').then(m => m.default)}
  },
};
