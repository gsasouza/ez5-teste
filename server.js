require('./config/config')
const express = require('express')
const PORT = process.env.PORT || 8080
const app = express()
const middlewares = require('./middlewares')

const orderBookRouter = require('./modules/orderBook').router

app.use('/api/order_book', orderBookRouter(express.Router()))

app.use(middlewares.errorHandler)
app.use(middlewares.notFound)

app.listen(PORT, (err) => {
  if (err) return console.log(err)
  console.log(`Listening on port ${PORT}`)
})

module.exports = app
