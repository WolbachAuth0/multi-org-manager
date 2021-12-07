const httpCodes = {
  200: { success: true, text: 'OK' },
  202: { success: true, text: 'ACCEPTED' },
  201: { success: true, text: 'CREATED' },
  204: { success: true, text: 'NO CONTENT' },
  207: { success: true, text: 'MULTI-STATUS' },
  304: { success: false, text: 'NOT MODIFIED' },
  400: { success: false, text: 'BAD REQUEST' },
  401: { success: false, text: 'UNAUTHORIZED' },
  403: { success: false, text: 'FORBIDDEN' },
  404: { success: false, text: 'NOT FOUND' },
  409: { success: false, text: 'CONFLICT' },
  500: { success: false, text: 'INTERNAL SERVER ERROR' },
  501: { success: false, text: 'NOT IMPLEMENTED' },
}

module.exports = function (req, res, { status, message, data }) {
  status = httpCodes.hasOwnProperty(status) ? status : 500
  const stat = httpCodes[status]
  const response = {
    method: req.method.toUpperCase(),
    controler: this.name,
    resource: req.baseUrl || '/',
    success: stat.success,
    status,
    statusText: stat.text,
    message,
    data
  }
  return response
}
