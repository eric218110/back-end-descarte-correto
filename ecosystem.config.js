const path = require('path')

module.exports = {
  apps : [
      {
        name: "back-end-tcc",
        script: path.resolve(__dirname, 'dist', 'main', 'server', 'index.js'),
        watch: true,
      }
  ]
}