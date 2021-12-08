const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')

if (process.env.NODE_ENV !== 'production') {
  console.log(`starting server in ${process.env.NODE_ENV} environment flag ...`)
  require('dotenv').config({ path: path.join(__dirname, './../.env') })
  require('dotenv').config({ path: path.join(__dirname, './../.env.development') })
}

const enforceHTTPS = require('./middleware/enforceHTTPS')
const { oidcMiddleware } = require('./middleware/auth')
// const { routerLogger, errorLogger } = require('./lib/Logger')

const app = express()

// middleware ...
app.use(express.json())
// app.use(routerLogger)

// TODO: decide if you want a whitelist or just have a global API.
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false }))

// must use secure socket layers
if(process.env.NODE_ENV === 'production') { app.use(enforceHTTPS) }

// Auth0 middleware for OIDC ... (for protecting admin views)
app.use(oidcMiddleware)

// here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, './../dist')))

// API routes
app.use('/api', require('./routes/hello')) // should serve api spec
app.use('/api/organizations', require('./routes/organizations'))
// app.use('/api/users', require('./routes/users'))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, (req, res) => {
  try {
    res.sendFile(path.join(__dirname, './../dist/index.html'))
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
})

module.exports = app
