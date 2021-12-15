const server = require('./api/server')
const { logger } = require('./api/models/Logger')

const port = process.env.NODE_ENV === 'development' ? 8081 : process.env.PORT || 8080
server.listen(port, () => {
  logger.info(`app is listening on port: ${port}`)
})
