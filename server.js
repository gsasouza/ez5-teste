const express = require('express')
const PORT = 8080 || process.env.PORT
const app = express()
global.Promise = require('bluebird')
const orderBookRouter = require('./modules/orderBook').router

app.use('/api/order_book', orderBookRouter(express.Router()))

app.listen(PORT, (err) => console.log('listening'))
