const fs = require('fs')
const path = require('path')
const stream = require('stream')
const util = require('util')
const zlib = require('zlib')

// date format
const formatDateTime = (text) => (new Date().toISOString().replace(/T/, text || ' ').replace(/\..+/, ''))

// write config
const cwd = process.cwd() || __dirname
const logPath = 'debug.log'
const logFile = fs.createWriteStream(path.resolve(cwd, logPath), { flags: 'a' })
const logStdout = process.stdout

// filesize config
let fileSizeInMegabytes = 0
if (fs.existsSync(logPath)) {
    const stats = fs.statSync(logPath)
    const fileSizeInBytes = stats.size
    fileSizeInMegabytes = fileSizeInBytes / 1000000.0
}

// compress config
const gzip = zlib.createGzip()
const source = fs.createReadStream(logPath)

// filesize condition and compressing
let isCompress = false
if (fileSizeInMegabytes > 50) {
    isCompress = true
}
if (isCompress) {
    const destination = fs.createWriteStream(`${logPath}.${formatDateTime('@')}.gz`)
    stream.pipeline(source, gzip, destination, (err) => {
        fs.truncate(logPath, () => {})
        if (err) {
            console.error('An error occurred:', err)
        }
    })
}

// writing log
const createLog = function () {
    const args = Array.from(arguments)
    const length = args.length
    const key = length > 1 ? args[length - 1] : ''
    const arrays = length > 1 ? args.slice(0, length - 1) : args
    const dateString = formatDateTime()
    if (key.trim() !== '') {
        logFile.write(`key: ${key}` + '\n')
        logStdout.write(`key: ${key}` + '\n')
    }
    logFile.write(`datetime: ${dateString}` + '\n')
    logFile.write(util.format.apply(null, arrays) + '\n')
    logFile.write('-'.repeat(50) + '\n')
    logStdout.write(util.format.apply(null, arrays) + '\n')
}

module.exports = {
    createLog
}
