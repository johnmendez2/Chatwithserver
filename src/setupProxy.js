// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/process_query',
    createProxyMiddleware({
      target: 'https://stagpt35model.azurewebsites.net',
      changeOrigin: true,
    })
  );
};
