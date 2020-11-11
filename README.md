# vue2-example-ssr

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### How to install or running
```
- initialized
$ yarn install 
$ yarn build
- optional run
$ yarn run:spa | yarn run:ssr
build production 
$ yarn start:production
```

### Libraries
1. Util Object - instead of lodash
- helper for object manipulation
- reference [https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore]
- available method: get, empty, has, omit, pick, pull
2. Util Text
- helper for text manipulation
- available method: capitalize, camelCase, kebabCase, snakeCase, etc...
3. Util Dom
- helper for dom [client side only]
- available method: screenOrientation, toggleFullScreen, userAgentInformation

### References
I. Server side Rendering
1. ssr.vuejs.org [http://ssr.vuejs.org]
- https://ssr.vuejs.org/guide/#installation
- https://ssr.vuejs.org/guide/structure.html
- https://ssr.vuejs.org/guide/routing.html
- https://ssr.vuejs.org/guide/bundle-renderer.html
- https://ssr.vuejs.org/guide/build-config.html
2. Moduslabs [https://labs.moduscreate.com/]
- https://www.youtube.com/watch?v=XJfaAkvLXyU&feature=youtu.be (Server side rendering with Vue.js 3)
- https://github.com/moduslabs/vue3-example-ssr
3. Namecheap [https://www.namecheap.com/]
- https://www.namecheap.com/blog/production-ready-vue-ssr-in-5-simple-steps/
- https://github.com/olegpisklov/vue-ssr-simple-setup

II. Breakpoint
1. Vuetify [https://vuetifyjs.com]
- https://vuetifyjs.com/en/features/breakpoints/

III. Layouting
1. Medium [https://medium.com]
- https://medium.com/@herujokoutomo/membuat-dynamic-layout-component-pada-vue-js-b8bef9b4eee