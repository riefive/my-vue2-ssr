const express = require('express')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const env = process.env.NODE_ENV || 'development'
const target = process.env.TARGET || 'spa'
const cwd = process.cwd() || __dirname

let configFile = '.env'
if (['development', 'production', 'staging'].includes(env)) {
    configFile = `.env.${env}`
}
require('dotenv').config({ path: path.resolve(cwd, configFile) })

const server = express()
const port = process.env.PORT || 3000
const messages = {
    notFound: 'Page not found',
    internalError: 'Internal server error'
}

if (target === 'spa') {
    server.use(express.static(path.resolve(cwd, './dist')))
    server.get('*', (req, res) => {
        res.status(404).send(messages.notFound)
    })
} else {
    const manifest = require('./bundle/ssr-manifest.json')
    const renderer = createBundleRenderer(require('./bundle/vue-ssr-server-bundle.json'), {
        runInNewContext: false,
        clientManifest: require('./dist/vue-ssr-client-manifest.json')
    })
    server.use('/css', express.static(path.resolve(cwd, 'dist', 'css')))
    server.use('/img', express.static(path.resolve(cwd, 'dist', 'img')))
    server.use('/js', express.static(path.resolve(cwd, 'dist', 'js')))
    server.use('/favicon.ico', express.static(path.resolve(cwd, 'dist', 'favicon.ico')))
    server.get('*', async (req, res) => {
        const context = {
            url: req.url,
            title: 'Vue SSR',
            meta: `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="keyword" content="vue,ssr">
            <meta name="description" content="vue srr demo">`.trim()
        }
        const [err, content] = await renderer.renderToString(context).then(v => [null, v]).catch(e => [e, null])
        if (err) {
            if (err.code === 404) {
                res.status(404).end(messages.notFound)
            } else {
                res.status(500).end(messages.internalError)
            }
        } else {
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <title>${process.env.TITLE || context.title}</title>
            <link rel="stylesheet" href="${manifest['app.css']}" />
            ${context.meta}
            </head>
            <body>
            ${content}
            </body>
            </html>`.trim()
            
            res.end(html)
        }
    })
}

server.listen(port, () => { 
    console.log(`Listening on: ${port} | env: ${env} | target: ${target}`)
})