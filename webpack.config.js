const libConfig = require('./webpack/lib.config')
const webConfig = require('./webpack/web.config')
const jqueryConfig = require('./webpack/jquery.config')

module.exports = [libConfig, webConfig, jqueryConfig]
