require('./config/config')
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./docs/swagger-docs')
const middlewares = require('./middlewares')
const orderBookRouter = require('./modules/orderBook').router

const PORT = process.env.PORT || 8080
const app = express()

app.use(cors())

app.get('/', (req, res) => res.redirect('/docs'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/api/order_book', orderBookRouter(express.Router()))

app.use(middlewares.errorHandler)
app.use(middlewares.notFound)

app.listen(PORT, (err) => {
  if (err) return console.log(err)
  console.log(`Listening on port ${PORT}`)
})

module.exports = app
