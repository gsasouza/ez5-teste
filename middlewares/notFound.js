/**
 * Middleware that handler when user request a route that not exists
 */
module.exports = (req, res) =>
  res.status(404).send({status: 404, message: 'Route not found', description: 'The route that you are looking does not exists'})
