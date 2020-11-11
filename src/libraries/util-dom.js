export function screenOrientation() {
    // based on - https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
    const orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation
    if (/landscape/i.test(orientation)) { return 'landscape' }
    if (/portrait/i.test(orientation)) { return 'portrait' }
    return 'none'
}

export function toggleFullScreen() {
    // based on - https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
    const doc = window.document
    const docEl = doc.documentElement
    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl)
    } else {
        cancelFullScreen.call(doc)
    }
}

export function userAgentInformation() {
    // based on 
    // 1. https://stackoverflow.com/a/4246539
    // 2. https://stackoverflow.com/a/59434639
    const result = {}
    const userAgent = navigator.userAgent
    const parts = userAgent.split(/\s*[)(]\s*/)
    const lastIndex = parts.length - 1
    if (lastIndex < 0) { return result }
    let name = 'unknow', version = 0
    const names = parts.length > 1 ? parts[1].toLowerCase().split(';') : ''
    if (['ipad', 'iphone'].includes(names[0])) { 
        Object.assign(result, { osName: 'ios', osVersion: names[2], deviceName: names[1] })
    } else if (['linux'].includes(names[0]) && names[1].includes('android')) {
        Object.assign(result, { osName: 'android', osVersion: names[1], deviceName: names[2] })
    } else if (['linux'].includes(names[0]) && ['u'].includes(names[1])) {
        Object.assign(result, { osName: 'linux', osVersion: names[1], language: names[2], deviceName: names[3] })
    } else if (['windows'].includes(names[0])) {
        Object.assign(result, { osName: 'windows', osVersion: names[1] })
    } else if (['macintosh'].includes(names[0])) {
        Object.assign(result, { osName: 'macintosh', osVersion: names[1] })
    } else if (['x11'].includes(names[0])) {
        Object.assign(result, { osName: 'linux' })
        if (names.length === 4) {
            Object.assign(result, { osVersion: names[2], codeName: names[1], arch: names[3] })
        } else {
            Object.assign(result, { arch: names[1] })
        }
    }
    const browsers = ['internet-explorer', 'edge', 'firefox', 'opera', 'safari', 'chrome']
    const regexes = []
    regexes[0] = userAgent.match(/(?:msie |trident.+? rv:)([0-9\.]+)/i)
    regexes[1] = userAgent.match(/(?:edg(e|a)+)\/([0-9\.]+)/i)
    regexes[2] = userAgent.match(/(?:firefox|fxios)\/([0-9\.]+)/i)
    regexes[3] = userAgent.match(/(?:^opera.+?version|opr)\/([0-9\.]+)/i)
    regexes[4] = userAgent.match(/version\/([0-9\.]+).+?safari/i)
    regexes[5] = userAgent.match(/(?:chrome|crios)\/([0-9\.]+)/i)
    for (let i = 0; i < regexes.length; i++) {
        const element = regexes[i]
        if (element) {
            name = browsers[i]
            version = element.length > 1 ? element[1] : 0
            if (name === 'edge') { version = element.length > 2 ? element[2] : version }
            break
        }
    }
    const rawFullVersion = parts[0].concat(' ').concat(parts[lastIndex])
    const rawArraysVersion = rawFullVersion.split(/([a-z\s]+\/[a-z0-9\.]+)/gi)
    const arraysVersion = rawArraysVersion.filter(v => v && v.trim() !== '').map(v => v.trim())
    Object.assign(result, { browserName: name, browserVersion: version, browserFullVersion: arraysVersion })
    return result
}
