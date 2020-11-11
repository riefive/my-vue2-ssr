// build tag
const buildTag = (item, type) => {
    let text = '<'.concat(type)
    for (const key in item) {
        const element = item[key]
        text = text.concat(` ${key}="${element}"`)
    }
    text = text.concat('>')
    if (type === 'script') { text = text.concat(`</${type}>`) }
    return text
}

// build tag with array
const buildTagArray = (data, type) => {
    if (!Array.isArray(data)) { return '' }
    let text = ''
    data.forEach((item) => {
        text = text.concat(buildTag(item, type)) + '\n'
    })
    return text
} 

module.exports = {
    buildTag,
    buildTagArray
}
