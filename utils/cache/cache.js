const NodeCache = require('node-cache')

module.exports = (expireTimeInSeconds = 70) => {
  /**
   * Cache object constructor
   */
  const cache = new NodeCache({
    stdTTL: expireTimeInSeconds,
    checkperiod: expireTimeInSeconds * 2
  })

  /**
   * Search if has data stored in cache
   * @param {String} key Key to be searched in cache
   * @returns {(Object | undefined)} Object containing the api's data or undefined if the key has expired/deleted
   */
  function getData (key) {
    return new Promise((resolve, reject) => {
      cache.get(key, (err, value) => {
        if (err) return reject(err)
        resolve(value)
      })
    })
  }

  /**
   * Set a key/value pair in cache
   * @param {String} key Key to be stored in cache
   * @param {Objetct} data Data to be stored in chate
   * @returns {(Object | undefined)} Object containing the data stored on cache
   */
  function setData (key, data) {
    return new Promise((resolve, reject) => {
      cache.set(key, data, (err, success) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }

  return {getData, setData}
}
