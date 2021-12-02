const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const serveStatic = require('serve-static')

const { oidcMiddleware, enforceHTTPS } = require('./lib/Auth')
const { routerLogger, errorLogger } = require('./lib/Logger')

const app = express()

// middleware ...
app.use(express.json())
app.use(routerLogger)
// TODO: decide if you want a whitelist or just have a global API.
app.use(cors())
// https://www.npmjs.com/package/helmet
app.use(helmet({
  contentSecurityPolicy: false
}))

// force TLS for auth0 - in production only (so I don't have deal with SSL certs in dev)
if (process.env.MODE === 'production') {
  app.use(enforceHTTPS)
}

// Auth0 middleware for OIDC ... (for protecting admin views)
app.use(oidcMiddleware)

// serve static assets
app.use('/public', serveStatic(path.join(__dirname, 'public')))

// set up routes
app.use('/', require('./routes/views'))
// app.use('/administrator', requiresAuth(), require('./routes/admin'))
app.use('/api/v1/oauth', require('./routes/oauth'))
app.use('/api/v1/quotes', require('./routes/quotes'))
app.use('/api/v1/authors', require('./routes/authors'))
app.use('/', require('./routes/errors'))

// express-winston errorLogger AFTER the other routes have been defined.
app.use(errorLogger)

module.exports = app
