const axios = require('axios')
const cache = require('../../utils/cache')()

/**
 * Search for the data on cache or on bitvalor's api
 * @returns {Object} Object containing the data
 */
function searchData () {
  const apiUrl = 'https://api.bitvalor.com/v1/order_book.json'
  const key = 'ApiData'
  return new Promise((resolve, reject) => {
    return cache.getData(key)
      .then((data) => data === undefined
        ? fetchApiData(apiUrl)
        : resolve(data)
      )
      .then((response) => cache.setData(key, response.data))
      .then((data) => resolve(data))
      .catch((err) => reject(err))
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
function isInBetween (min = 0, max, number) {
  let result = true
  if (max) result = number <= max
  return number >= min && result
}

/**
 * Test if a exchange from the bitvalors' api is equal the searched value
 * @param {String} exchange Desired exchange value
 * @param {String} value Test value
 * @returns {Boolean}  A boolean value that represents the result, true if is equal or false if isn't
 */
function testExchange (exchange, value) {
  if (exchange) return exchange === value
  return true
}

/**
 * Filter the bitvalor's api data using the search query values
 * @param {Object} query search values to be filtered
 * @returns {Boolean} A boolean value that represents the result
 */
const filterData = (query) => (value) => {
  return (testExchange(query.exchange, value[0])) &&
    (isInBetween(query.minValue, query.maxValue, value[1])) &&
    (isInBetween(query.minQuantity, query.maxQuantity, value[2]))
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
      if (req.query.type) {
        if (['asks', 'bids'].indexOf(req.query.type) !== -1) result = result[req.query.type].filter(filterData(req.query))
        else result = []
      } else Object.keys(result).forEach((key) => result[key] = result[key].filter(filterData(req.query)))

      return res.status(200).send({status: 200, message: 'Data loaded successfully', data: result})
    })
    .catch((err) => next(err))
}

module.exports = process.env.NODE_ENV === 'development' ? {findData}
: {findData, filterData, testExchange, isInBetween, fetchApiData, searchData}