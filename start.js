const server = require('./api/server')

const port = process.env.NODE_ENV === 'development' ? 8081 : process.env.PORT || 8080
server.listen(port, () => {
  console.log(`app is listening on port: ${port}`)
})
