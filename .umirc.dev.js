// .umirc.test.ts
import {
  defineConfig
} from 'umi';

export default defineConfig({
  define: {
    ENV: 'development',
  },
  // base: './',
  // publicPath: './',
  hash: false,
  history: {
    type: 'hash', //[browser, hash, memory]
  },
  targets: {
    ie: 11,
  },
  // publicPath: './',
  favicon: './favicon.ico',
  proxy: {
    //  本地测试
    // '/person': {
    //   target: 'http://192.168.1.21:8018',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/person': ''
    //   }
    // },
    '/api': {
      target: 'http://192.168.1.133:82',
      // target: 'www.v-city.com.cn',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    },
    '/img': {
      target: 'http://192.168.1.133:91',
      // target: 'www.v-city.com.cn',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/img': ''
      // }
    },
  },
})
