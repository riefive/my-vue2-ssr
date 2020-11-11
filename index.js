const express = require('express')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const cwd = process.cwd() || __dirname
const env = process.env.NODE_ENV || 'development'
const test = process.env.VUE_TEST || false

if (!test) {
    let configFile = '.env'
    if (['development', 'production', 'staging'].includes(env)) {
        configFile = `.env.${env}`
    }
    require('dotenv').config({ path: path.resolve(cwd, configFile) })
}

const target = process.env.VUE_TARGET || 'spa'
const title = process.env.TITLE

const buildAttribute = (item, type) => {
    let text = '<'.concat(type)
    for (const key in item) {
        const element = item[key]
        text = text.concat(` ${key}="${element}"`)
    }
    text = text.concat('>')
    if (type === 'script') { text = text.concat(`</${type}>`) }
    return text
}

const buildAttributeArrays = (data, type) => {
    if (!Array.isArray(data)) { return '' }
    let text = ''
    data.forEach((item) => {
        text = text.concat(buildAttribute(item, type)) + '\n'
    })
    return text
} 

const server = express()
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
    let scripts = ''
    if (typeof clientManifest === 'object') {
        links = links.concat(
            buildAttribute({ rel: 'icon', href: '/favicon.ico' }, 'link')
        )
        if (clientManifest.hasOwnProperty('async') && Array.isArray(clientManifest.async)) {
            const arrays = clientManifest.async
            links = links.concat('\n').concat(
                buildAttributeArrays(arrays.map(v => ({ href: v, rel: 'prefetch' })), 'link')
            )
        }
        if (clientManifest.hasOwnProperty('initial') && Array.isArray(clientManifest.initial)) {
            const arrays = clientManifest.initial
            arrays.reverse()
            links = links.concat(
                buildAttributeArrays(arrays.map(v => ({ href: v, rel: 'preload', as: 'script' })), 'link')
            )
            scripts = scripts.concat(
                buildAttributeArrays(arrays.map(v => ({ type: 'text/javascript', src: v })), 'script')
            )
        }
    }
    const metas = buildAttributeArrays([
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'keyword', content: 'vue,ssr' },
        { name: 'description', content: 'vue srr demo' }
    ], 'meta').trim()

    server.get('*', async (req, res) => {
        const context = {
            url: req.url,
            title: 'Vue SSR',
            metas,
            links,
            scripts
        }
        const [err, content] = await renderer.renderToString(context).then(v => [null, v]).catch(e => [e, null])
        if (err) {
            console.log(err)
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
            <title>${title || context.title}</title>
            ${context.metas}
            ${context.links}
            </head>
            <body>
            ${content}
            ${context.scripts}
            </body>
            </html>`.replace(/\s{2,}\</g, (pretty ? '\n' : '').concat('<')).trim()
            res.end(html)
        }
    })
}

server.listen(port, () => { 
    console.log(`Listening on: ${port} | env: ${env} | target: ${target}`)
})