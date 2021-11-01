'use strict'
const os = require('os')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const proxyTable = require('../config/proxyTable')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

function getIPAddress(){
  const interfaces = os.networkInterfaces()
  for(let devName in interfaces){
    let iface = interfaces[devName]
    for(let i = 0; i < iface.length; i++){
      let alias = iface[i]
      if(alias.family === 'IPv4' &&
      alias.address !== '127.0.0.1' &&
      !alias.internal){
        return alias.address
      }
    }
  }
}
const myIp = getIPAddress() //本地IP地址

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    before: require('../mock/mock-server.js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/' + process.env.env_config + '.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'big-data-cockpit',
      templateParameters: {
        BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
      },
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port
      const list = [
        `Your application is running here: http://localhost:${port}`
      ]
      for (const key in proxyTable) {
        list.push(`${key} application is running here: http://${myIp}:${port}/?pt=${key}`)
      }
      for (const key in proxyTable) {
        proxyTable[key].forEach((item)=>{
          list.push(`${key} ${item.base} doc: ${item.url}${item.base}/doc.html`)
        })
      }
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: list
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
