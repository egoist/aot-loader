
# aot-loader

[![NPM version](https://img.shields.io/npm/v/aot-loader.svg?style=flat)](https://npmjs.com/package/aot-loader) [![NPM downloads](https://img.shields.io/npm/dm/aot-loader.svg?style=flat)](https://npmjs.com/package/aot-loader) [![CircleCI](https://circleci.com/gh/egoist/aot-loader/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/aot-loader/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat)](https://chat.egoist.moe)

__This is similar to [babel-plugin-preval](https://github.com/kentcdodds/babel-plugin-preval) except that this is a webpack loader, which means you can write asynchronous code but import the resolved data synchronously.__

__It's also similar to [val-loader](https://github.com/webpack-contrib/val-loader) but this loader returns resolved data as JSON object directly.__

## Install

```bash
yarn add aot-loader --dev
```

## Usage

Import a file that you intend to pre-evaluate:

📝 __entry.js__:

```js
import data from './data?aot'

console.log(data)
```

📝 __data.js__:

```js
const axios = require('axios')

module.exports = async () => {
  const posts = await axios.get('http://example.com/posts.json')
  return { posts }
}
```

Then update your webpack config to pre-evaluate `.js` files with `?aot` query at compile time:

📝 __webpack.config.js__:

```js
module.exports = {
  entry: './entry.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'post',
        resourceQuery: /\?aot$/,
        loader: 'aot-loader'
      },
      // Following is optional, depending on your needs
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}
```

### Without resource query

```js
import data from /* aot */ './data'
// ↓↓↓ transpiled to:
import data from './data?aot'
```

To achieve this, you can use the aot babel plugin in your `.babelrc`:

```js
{
  "plugins": [
    "module:aot-loader/babel"
  ]
}
```

## API

### Loader options

#### getData

- __Type__: `(exported, context) => data || Promise<data>`

Get data from the exported object of the file that is being evaluated.

Default value:

```js
function (exported, context) {
  return typeof exported === 'function' ? exported(context) : exported
}
```

#### context

The `context` argument in `getData`.

Default:

```js
{
  loader: LoaderContext
}
```

Check out the [LoaderContext](https://webpack.js.org/api/loaders/#the-loader-context) API.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**aot-loader** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/aot-loader/contributors)).

> [github.com/egoist](https://github.com/egoist) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
