import { defineConfig } from 'umi';

export default defineConfig({
  title: '智慧校区',
  copy: ['./src/assets/favicon.ico'],
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
  proxy:{
    '/api': {
      target: 'http://192.168.1.133:82',
      // target: 'www.v-city.com.cn',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    },
  }
  // favicon: '/assets/favicon.ico',
});
