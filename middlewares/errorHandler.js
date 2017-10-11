/**
 * Middlewares that handler errors *
 */
module.exports = (err, req, res, next) => {
  if (err) return res.status(500).send({status: 500, message: 'Unexpected error on server', description: err.message})
  next()
}