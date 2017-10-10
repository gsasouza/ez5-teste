const NodeCache = require('node-cache')

module.exports = (expireTimeInSeconds = 70) => {
  const cache = new NodeCache({
    stdTTL: expireTimeInSeconds,
    checkperiod: expireTimeInSeconds * 2
  })
  return cache
}
