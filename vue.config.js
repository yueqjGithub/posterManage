// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
module.exports = {
  devServer: {
    port: 8083,
    open: true,
    proxy: {
      '/api': {
        target: '', // 对应自己的接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  productionSourceMap: process.env.NODE_ENV !== 'production',
  // productionSourceMap: true,
  css: {
    extract: process.env.NODE_ENV === 'production', // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: process.env.NODE_ENV !== 'production' // 开启 CSS source maps?
  }
}
