export function capitalize(value) {
    // based on - https://www.w3resource.com/javascript-exercises/javascript-string-exercise-8.php
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export function capitalizeWords(value) {
    // based on - https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
    return value.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
}

export function camelCase(value) {
    // based on - https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    return value.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())
}

export function kebabCase(value) {
    // aka parameterize a string
    // based on - https://www.w3resource.com/javascript-exercises/javascript-string-exercise-7.php
    return value.trim().toLowerCase().replace(/[^a-zA-Z0-9 -]/, '').replace(/\s/g, '-')
}

export function snakeCase(value) {
    // based on - https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-120.php
    return value && value
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_')
}

export function abbreviation(value) {
    // based on - https://www.w3resource.com/javascript-exercises/javascript-string-exercise-5.php
    let text = ''
    const splitNames = String(value).trim().split(' ')
    if (splitNames.length > 1) {
        text = splitNames[0].charAt(0) + splitNames[1].charAt(0)
    } else {
        text = splitNames[0].charAt(0)
    }
    return text.toUpperCase()
}

export function truncate(value, length, separator = null) {
    // based on - https://www.w3resource.com/javascript-exercises/javascript-string-exercise-4.php
    if (typeof value === 'string' && length > 0) {
        const result = value.slice(0, length)
        return value.length < length ? result : result.concat(separator || '...')
    }
    return value
}

export function filterText(text, type) {
    type = type || 'capitalize'
    if (type === 'capitalize') { return capitalize(text) }
    if (type === 'ucwords') { return capitalizeWords(text) }
    if (type === 'camelCase') { return camelCase(text) }
    if (type === 'kebabCase') { return kebabCase(text) }
    if (type === 'snakeCase') { return snakeCase(text) }
    if (type === 'upperCase') { return text.toUpperCase() }
    if (type === 'lowerCase') { return text.toLowerCase() }
    return text
}
