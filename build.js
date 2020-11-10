const fs = require('fs')
const path = require('path')
const cpx = require('cpx')
const rimraf = require('rimraf')

const outputName = '.html'
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
const content = JSON.stringify(project, null, 4)
const filedir = path.resolve(cwd, outputName, 'package.json')
const mkdir = path.dirname(filedir)

if (fs.existsSync(outputPath)) {
    rimraf(outputPath, (err) => { 
        if (err) { console.log(err) }
    })
}

setTimeout(() => {
    fs.mkdirSync(mkdir, { recursive:true })
    fs.writeFileSync(filedir, content)
    cpx.copySync('./bundle/**', outputPath + '/bundle')
    cpx.copySync('./dist/**', outputPath + '/dist')
    cpx.copySync('./index.js', outputPath)
    cpx.copySync('./.env', outputPath)
}, 1000)
