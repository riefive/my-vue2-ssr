const express = require('express')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const mode = process.env.MODE || 'standart'

const port = 3000
const server = express()

server.use( express.static(path.resolve(__dirname, './dist')))

if (mode === 'plugin') {
    const renderer = createBundleRenderer(require('./dist-ssr/vue-ssr-server-bundle.json'), {
        runInNewContext: false,
        clientManifest: require('./dist/vue-ssr-client-manifest.json')
    })
    server.get('*', async (req, res) => {
        const context = { url: req.url }
        const [err, html] = await renderer.renderToString(context).then(v => [null, v]).catch(e => [e, null])
        if (err) {
            if (err.code === 404) {
                res.status(404).end('Page not found')
            } else {
                res.status(500).end('Internal Server Error')
            }
        } else {
            res.end(html)
        }
        /*
        let html
        try {
            html = await renderer.renderToString(context)
        } catch (error) {
            if (error.code === 404) {
                return res.status(404).send('404 | Page Not Found')
            }
            return res.status(500).send('500 | Internal Server Error')
        }
        res.end(html)
        */
    })
} else {
    const manifest = require('./dist-ssr/ssr-manifest.json')
    const appPath = manifest['app.js']
    const appFile = path.resolve(__dirname, 'dist-ssr') + appPath
    const createApp = require(appFile).default
    createApp(context).then(app => {
        console.log(app)
    }).catch(err => console.log(err))
}

server.listen(port, () => console.log(`Listening on: ${port}`))