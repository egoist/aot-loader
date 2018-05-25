const req = require('require-from-string')
const { getOptions } = require('loader-utils')

const defaultGetData = (exported, context) => {
  return typeof exported === 'function' ? exported(context) : exported
}

module.exports = async function (source) {
  this.cacheable()

  const done = this.async()
  const options = getOptions(this) || {}
  const context = options.context
  const getData = options.getData || defaultGetData

  try {
    let exported = req(source, this.resourcePath)
    exported = exported.default || exported
    const data = await getData(exported, context)
    done(null, `export default ${JSON.stringify(data)}`)
  } catch (err) {
    done(err)
  }
}
