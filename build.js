const fs = require('fs')
const path = require('path')
const cpx = require('cpx')
const rimraf = require('rimraf')

const outputName = '.appview'
const outputPath = `./${outputName}`
const cwd = process.cwd() || __dirname
const package = require('./package.json')
const project = Object.assign({
    name: 'ssr-builder',
    description: 'Vue SSR Builder',
    version: '0.1.0',
    author: {
        name: 'riefive',
        email: 'rie.five@gmail.com'
    }
})

Object.assign(project, { dependencies: package.dependencies })
const filedir = path.resolve(cwd, outputName, 'package.json')
const mkdir = path.dirname(filedir)
const content = JSON.stringify(project, null, 4)
const readme = `
# To running app
$ yarn install
$ export NODE_ENV=production && node index \n
# Options env
- development
- production
- staging
`.trim()

if (fs.existsSync(outputPath)) {
    rimraf(outputPath, (err) => { 
        if (err) { console.log(err) }
    })
}

setTimeout(() => {
    fs.mkdirSync(mkdir, { recursive:true })
    fs.writeFileSync(filedir, content)
    fs.writeFileSync(path.resolve(cwd, outputName, 'README.md'), readme)
    cpx.copySync('./bundle/**', outputPath + '/bundle')
    cpx.copySync('./dist/**', outputPath + '/dist')
    cpx.copySync('./index.js', outputPath)
    cpx.copySync('./.env', outputPath)
    cpx.copySync('./.env.development', outputPath)
    cpx.copySync('./.env.production', outputPath)
    cpx.copySync('./.env.staging', outputPath)
}, 2500)
