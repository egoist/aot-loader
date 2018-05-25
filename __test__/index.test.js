const path = require('path')
const { promisify } = require('util')
const webpack = require('webpack')
const req = require('require-from-string')
const babel = require('@babel/core')

test('loader', async () => {
  const compiler = webpack({
    mode: 'development',
    devtool: false,
    entry: path.join(__dirname, 'fixture/entry.js'),
    output: {
      path: '/',
      filename: 'main.js',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [{
        test: /\.js$/,
        resourceQuery: /^\?aot$/,
        loader: require.resolve('..')
      }]
    }
  })

  const mfs = new webpack.MemoryOutputFileSystem()
  compiler.outputFileSystem = mfs

  const stats = await promisify(compiler.run.bind(compiler))()
  if (stats.hasErrors()) {
    throw new Error(stats.toString('errors-only'))
  }

  const output = mfs.readFileSync('/main.js', 'utf8')
  expect(output).toMatchSnapshot()
  expect(req(output).default).toEqual({ foo: 'bar' })
})

test('babel', () => {
  const { code } = babel.transform(`import foo from 'foo'\nimport bar from /* aot */'bar'`, {
    babelrc: false,
    plugins: [require.resolve('../babel')]
  })
  expect(code).toMatchSnapshot()
})
