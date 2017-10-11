/**
 * Middleware that handler when user request a route that not exists
 */
module.exports = (req, res) => res.status(404).send({status: 404, message: 'Page not found'})
