export function get(object, path, value) {
    // based on - https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab#gistcomment-3048575
    const pathArray = Array.isArray(path) ? path : String(path).split('.').filter(key => key)
    const pathArrayFlat = pathArray.flatMap(part => typeof part === 'string' ? part.split('.') : part)
    return pathArrayFlat.reduce((obj, key) => obj && obj[key], object) || value
}

export function empty(value) {
    // based on - https://stackoverflow.com/a/58930105
    const type = typeof value
    if ((value !== null && type === 'object') || type === 'function') {
        const properties = Object.keys(value)
        if (properties.length === 0 || properties.size === 0) { return true } 
    } 
    return !value
}

export function has(object, key) {
    // based on - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_has
    const keyParts = key.split('.')
    return !!object && (
        keyParts.length > 1 ? has(object[key.split('.')[0]], keyParts.slice(1).join('.')) : hasOwnProperty.call(object, key)
    )
}

export function omit(object, keys) {
    // based on - https://stackoverflow.com/a/43011812
    const target = {}
    for (const key in object) { 
        if (keys.includes(key)) { continue }
        if (!object.hasOwnProperty(key)) { continue } 
        target[key] = object[key] 
    } 
    return target
}

export function pick(object, keys) {
    // based on - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
    return keys.reduce((target, key) => {
        if (object && object.hasOwnProperty(key)) { target[key] = object[key] }
        return target
    }, {})
}

export function pickBy(object) {
    // based on - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pickby
    const target = {}
    for (const key in object) {
        if (object[key]) { target[key] = object[key] }
    }
    return target
}

export function pull(array, ...removeList) {
    // based on - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pull
    let list = []
    if (Array.isArray(removeList) && removeList.length > 0) {
        const firstList = removeList[0]
        list = Array.isArray(firstList) ? firstList : removeList 
    }
    const removeSet = new Set(list) 
    return array.filter(el => !removeSet.has(el))
}
