const path = require('path')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')
const { createLog } = require('./helpers/helper-debug')
const { buildTag, buildTagArray } = require('./helpers/helper-tag-html')

const cwd = process.cwd() || __dirname
const env = process.env.NODE_ENV || 'development'
const test = process.env.VUE_TEST || false
const configFile = ['development', 'production', 'staging'].includes(env) ? `.env.${env}` : '.env'
if (!test) {
    require('dotenv').config({ path: path.resolve(cwd, configFile) })
}

const server = express()
const target = process.env.VUE_TARGET || 'spa'
const title = process.env.TITLE
const port = process.env.PORT || 3000
const pretty = !['production', 'staging'].includes(env)
const messages = {
    notFound: 'Page not found',
    internalError: 'Internal server error'
}

server.use(express.static(path.resolve(cwd, './dist')))

if (target === 'spa') {
    server.get('*', (req, res) => {
        res.status(404).send(messages.notFound)
    })
} else {
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    const renderer = createBundleRenderer(require('./bundle/vue-ssr-server-bundle.json'), {
        runInNewContext: false,
        clientManifest
    })
    
    let links = ''
    let styles = ''
    let scripts = ''
    if (typeof clientManifest === 'object') {
        links = links.concat(
            buildTag({ rel: 'icon', href: '/favicon.ico' }, 'link')
        )
        if (clientManifest.hasOwnProperty('async') && Array.isArray(clientManifest.async)) {
            const arrays = clientManifest.async
            links = links.concat('\n').concat(
                buildTagArray(arrays.map(v => ({ href: v, rel: 'prefetch' })), 'link')
            )
        }
        if (clientManifest.hasOwnProperty('initial') && Array.isArray(clientManifest.initial)) {
            const arrays = clientManifest.initial
            arrays.sort((a, b) => {
                if (a > b) { return 1 }
                if (b > a) { return -1 }
                return 0
            })
            const linkMaps = arrays.map(v => ({ href: v, rel: 'preload', as: /\.css$/.test(v) ? 'style' : 'script' }))
            links = links.concat(buildTagArray(linkMaps, 'link'))
            const styleMaps = arrays.filter(v => /\.css$/.test(v)).map(v => ({ href: v, rel: 'stylesheet' }))
            styles = styles.concat(buildTagArray(styleMaps, 'link'))
            arrays.reverse()
            const scriptMaps = arrays.filter(v => /\.js$/.test(v)).map(v => ({ type: 'text/javascript', src: v }))
            scripts = scripts.concat(buildTagArray(scriptMaps, 'script'))
        }
    }
    const metas = buildTagArray([
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'keyword', content: 'vue,ssr' },
        { name: 'description', content: 'vue srr demo' }
    ], 'meta').trim()

    server.get('*', async (req, res) => {
        const context = { url: req.url, metas, links, styles, scripts }
        const [err, content] = await renderer.renderToString(context).then(v => [null, v]).catch(e => [e, null])
        if (err) {
            const errString = typeof err === 'object' ? JSON.stringify(err, null, 4) : err.toString()
            createLog(errString, 'ssr-routing')
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
            <title>${title || 'Vue SSR'}</title>
            ${context.metas}
            ${context.links}
            ${context.styles}
            </head>
            <body>
            <noscript>
            <strong>We're sorry but app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
            </noscript>
            ${content}
            ${context.scripts}
            </body>
            </html>`
            .replace(/\s+\</g, (pretty ? '\n' : '').concat('<'))
            .replace(/\>\s+/g, ''.concat('>').concat(pretty ? '\n' : ''))
            .trim()
            
            res.end(html)
        }
    })
}

server.listen(port, () => { 
    console.log(`Listening on: ${port} | env: ${env} | target: ${target}`)
})

process.on('unhandledRejection', (err) => { 
    createLog(err.toString(), 'unhandled-rejection') 
})

process.on('uncaughtException', (err) => { 
    createLog(err.toString(), 'uncaught-exception') 
})