const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()
const ENVIRON = process.env.NODE_ENV

if(ENVIRON === 'production') {
  app.use(enforceHTTPS)
}

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`app is listening on port: ${port}`)
})


function enforceHTTPS(req, res, next) {
  const scheme = req.headers['x-forwarded-proto']
  const host = req.headers.host
  const url = req.url
  if (scheme !== 'https') {
    res.redirect(`https://${host}${url}`)
  } else {
    next()
  }
}