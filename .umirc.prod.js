// .umirc.pro.ts 
import {
  defineConfig
} from 'umi';

export default defineConfig({
  define: {
    ENV: 'production',
  },
  favicon: './favicon.ico',
  hash: true,
  history: {
    type: 'hash',
  },
  // base: './',
  publicPath: './',
  outputPath: './dist',
  nodeModulesTransform: {
    type: 'none',
  },
  targets: {
    ie: 11,
  },
  metas: [{
    name: 'renderer',
    content: 'webkit'
  }, {
    'http - equiv': 'Content-Security-Policy',
    'content': 'upgrade-insecure-requests',
  }],

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
      // target: 'http://192.168.1.133:82',
      target: 'www.v-city.com.cn',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    },
    '/img': {
      // target: 'http://192.168.1.133:91',
      target: 'www.v-city.com.cn',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/img': ''
      // }
    },
  },
  esbuild: {},
  dynamicImport: {
    loading: '@/Loading',
  },
  // chunks: ['vendors', 'umi'],

  chainWebpack: function (config) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            // vendor: {
            //   name: 'vendors',
            //   chunks: 'async',
            //   test({ resource }) {
            //     return /[\\/]node_modules[\\/](react|immer|moment｜moment-timezone｜echarts｜use-immer|react-dom|react-router|react-router-dom|lodash|lodash-decorators|redux-saga|re-select|dva|moment)[\\/]/;
            //   },
            //   priority: 10,
            // },
            // antdesigns: {
            //   name: 'antdesigns',
            //   chunks: 'async',
            //   test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
            //   priority: -11,
            // },
            cesium: {
              name: 'cesium',
              chunks: 'async',
              test: /[\\/]node_modules[\\/](cesium)[\\/]/,
              priority: 10,
            },
            // default: {
            //   chunks: 'async',
            //   minChunks: 2,
            //   priority: -20,
            //   test: /[\\/]node_modules[\\/]/,
            //   reuseExistingChunk: true
            // }
          },
        },
      }
    });
  },
})
