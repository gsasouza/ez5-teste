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
      .then((data) => data
        ? resolve(data)
        : fetchApiData(apiUrl)
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

function validateQuery (query = {}) {
  let valid = true
  if (query.maxValue) valid = parseInt(query.maxValue) > parseInt(query.minValue || 0) && valid
  if (query.maxQuantity) valid = parseInt(query.maxQuantity) > parseInt(query.minQuantity || 0) && valid
  if (query.type) valid = (['asks', 'bids'].indexOf(query.type) !== -1) && valid
  if (query.exchange) valid = (['ARN', 'B2U', 'BAS', 'BIV', 'BSQ', 'FLW', 'FOX', 'LOC', 'MBT', 'NEG', 'PAX'].indexOf(query.exchange) !== -1) && valid
  return valid
}

/**
 * Router middleware to find data
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} next
 */
function findData (req, res, next) {
  const query = req.query
  if (!validateQuery(query)) return res.status(400).send({status: 400, message: 'Bad Request', description: 'Invalid query parameters'})
  searchData()
    .then((data) => {
      let result = data
      if (query.type) result = {[query.type]: result[query.type].filter(filterData(query))}
      else Object.keys(result).forEach((key) => result[key] = result[key].filter(filterData(query)))

      return res.status(200).send({status: 200, message: 'Data loaded successfully', data: result})
    })
    .catch((err) => next(err))
}

module.exports = process.env.NODE_ENV !== 'test' ? {findData}
: {findData, filterData, testExchange, isInBetween, fetchApiData, searchData}
