const controller = require('./controller')
module.exports = (router) => {
  router.route('/')
    .get(controller.findData)

  return router
}
