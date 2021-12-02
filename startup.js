const path = require('path')
const mode = process.argv[2]

/**
 * HEROKU BEST PRACTICES
 * https://devcenter.heroku.com/articles/node-best-practices
 */
switch(mode) {
  case 'dev':
    require('dotenv').config({ path: path.join(__dirname, './.env.dev') })
    break;
  case 'local':
    require('dotenv').config({ path: path.join(__dirname, './.env.local') })
    break
  default:
    // read environment vars from heroku settings - not from .env.prod file
    // require('dotenv').config({ path: path.join(__dirname, './.env.prod') })
}

const app = require('./server/index.js')

startup(app)

/**
 * Startup the server
 */
async function startup(app) {
  logger.info(`starting app in ${mode} mode.`)
  logger.info(`loaded environment variables from ${process.env.MODE} settings.`)

  // TODO: if one exists, connect to database
  const port = process.env.PORT || 8081
  // listen to requests
  app.listen(port, () => {
    logger.info(`Application started in ${process.env.MODE} mode`)
    logger.info(`Express.js server is running on port: ${port}`)
  })
}

/**
 * Gracefully stop the server
 */
async function shutdown(database) {
  if (database) {
    try {
      logger.info(`Initiate graceful shutdown ...`)
      await database.disconnect()
      logger.info('Shutdown complete.')
    } catch (error) {
      logger.info('Graceful shutdown wasn\'t graceful ...')
      console.error(error)
    }
  }
  process.kill(process.pid, 'SIGUSR2')
  process.exit()
}

module.exports = {
  startup,
  shutdown
}
