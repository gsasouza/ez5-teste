const axios = require('axios')
const data = require('./mock.js')
const cache = require('../../utils/cache')()

/**
 * Search for the data on cache or on bitvalor's api
 * @returns {Object} Object containing the data
 */
function searchData () {
  const apiUrl = 'https://api.bitvalor.com//order_book.json'
  const keyName = 'ApiData'
  return new Promise((resolve, reject) => {
    return searchDataInCache(keyName)
    .then((data) => {
      if (!data) return fetchApiData(apiUrl)
      return resolve(data)
    })
    .then((response) => {
      cache.set(keyName, response.data, (err, success) => {
        if (err) reject(err)
        return resolve(response.data)
      })
    })
    .catch((err) => reject(err))
  })
}
/**
 * Search if has data stored in cache
 * @param {String} key Key to be searched in cache
 * @returns {(Object | undefined)} Object containing the api's data or undefined if the key has expired/deleted
 */
function searchDataInCache (key) {
  console.log('cache')
  return new Promise((resolve, reject) => {
    cache.get(key, (err, value) => {
      if (err) return reject(err)
      resolve(value)
    })
  })
}

/**
 * Fetch data from bitvalor's public API
 * @returns {Promise<string>} A promise that contains the api's data when fullfiled
 */
function fetchApiData (apiUrl) {
  console.log('api')
  return axios.get(apiUrl)
}

/**
 * Test if a number is between two others
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} number 
 * @returns {Boolean} A boolean value that represents the result, true if the number is between or false if isn't
 */
function isBetween (min = 0, max, number) {
  let result = true
  if(max) result = number <= max
  return number >= min && result
}

/**
 * Test if a exchange from the bitvalors' api is equal the searched value
 * @param {String} exchange Desired exchange value
 * @param {String} value Test value
 * @returns {Boolean}  A boolean value that represents the result, true if is equal or false if isn't
 */
function filterExchange (exchange, value) {
  if (exchange) return exchange === value
  return true
}

/**
 * Filter the bitvalor's api data using the search query values
 * @param {Object} query search values to be filtered
 * @returns {Boolean} A boolean value that represents the result
 */
const filterData = (query) => (value) => {
  return (filterExchange(query.exchange, value[0])) &&
    (isBetween(query.minValue, query.maxValue, value[1])) &&
    (isBetween(query.minQuantity, query.maxQuantity, value[2]))
}

/**
 * Router middleware to find data
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} next
 */
function findData (req, res, next) {
  searchData()
    .then((data) => {      
      let result = data
      if (req.query.type) result = result[req.query.type].filter(filterData(req.query))
      else Object.keys(result).forEach((key) => result[key] = result[key].filter(filterData(req.query)))
      return res.status(200).send(result)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send(err)
    })
}

module.exports = {findData}
