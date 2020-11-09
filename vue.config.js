const path = require('path')
const NodeExternals = require('webpack-node-externals')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = {
    outputDir: path.resolve(__dirname, !process.env.SSR ? '.dist-spa' : '.dist-ssr'),
    chainWebpack: webpackConfig => {
        if (!process.env.SSR) {
            webpackConfig.entry('app').clear().add('./src/entry-client.js')
            webpackConfig.devServer.disableHostCheck(true)
        } else {
            webpackConfig.entry('app').clear().add('./src/entry-server.js')
            webpackConfig.target('node')
            webpackConfig.devtool('source-map')
            webpackConfig.output.libraryTarget('commonjs2')
            webpackConfig.externals(NodeExternals({ allowlist: /\.(css|vue)$/ }))
            webpackConfig.optimization.splitChunks(false).minimize(false)
            webpackConfig.plugins.delete('hmr')
            webpackConfig.plugins.delete('preload')
            webpackConfig.plugins.delete('prefetch')
            webpackConfig.plugins.delete('progress')
            webpackConfig.plugins.delete('friendly-errors')
        }
    },
    configureWebpack: {
        plugins: [
            !process.env.SSR ? new VueSSRClientPlugin() : new VueSSRServerPlugin()
        ]
    }
}