import { createApp } from './main.js'

export default context => {
    return new Promise((resolve, reject) => {
        const { app, router } = createApp()
        const pathUrl = context.url

        router.push(pathUrl).catch((err) => {
            if (err.name === 'NavigationDuplicated') { return router.currentRoute }
            throw err
        })

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length) { return reject({ code: 404, url: pathUrl }) }
            resolve(app)
        }, reject)
    })
}
