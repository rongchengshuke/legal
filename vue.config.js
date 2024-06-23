module.exports = {
  transpileDependencies:['@dcloudio/uni-ui'],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://39.107.139.52', // 后端服务地址
        changeOrigin: true, // 允许webSocket跨域
        ws: true,
        pathRewrite: {
          // '^/api': '' // 如果API路径中包含'/api'，这里可以去除
        }
      }
    }
  }
};