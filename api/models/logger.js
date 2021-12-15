const { createLogger, format, transports } = require('winston') // https://www.npmjs.com/package/winston
const { combine, timestamp, label, printf, prettyPrint, colorize } = format
const expressWinston = require('express-winston')

const formatter = combine(
    label({ label: `[${process.env.NODE_ENV}]` }),
    timestamp(),
    prettyPrint(),
    colorize(),
    printf(info => `(${info.timestamp}) ${info.label} ${info.level}: ${info.message}`)
  )

const ConsoleTransport = new transports.Console({
  level: 'debug',
  colorize: true,
  timestamp() {
    return (new Date()).toLocaleTimeString()
  },
  prettyPrint: true
})

const logger = new createLogger({
  transports: [ ConsoleTransport ],
  format: formatter,
  level: 'info'
})

// set up the express-router-logger
const routerLogger = expressWinston.logger({
  winstonInstance: logger,
  level(req, res) { return 'info' },
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  ignoreRoute(req, res) {
    const substrings = [ '.css', '/img', '.js', '.ico', '.png' ]
    return substrings.some(x => req.url.indexOf(x) >=0)
  },
  colorize: true,
})

// set up the express-error-logger
const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  level: 'error'
})

module.exports = { logger, routerLogger, errorLogger }