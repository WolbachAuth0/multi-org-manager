module.exports = function (req, res, next) {
  const scheme = req.headers['x-forwarded-proto']
  const host = req.headers.host
  const url = req.url
  if (scheme !== 'https') {
    res.redirect(`https://${host}${url}`)
  } else {
    next()
  }
}
