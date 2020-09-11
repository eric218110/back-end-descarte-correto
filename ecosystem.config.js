const path = require('path')

module.exports = {
  apps : [
      {
        name: "BackEndTCC",
        script: path.resolve(__dirname, 'dist', 'main', 'server', 'index.js'),
        watch: true,
        env: {
          "PORT": "1996",
          "MODE": "prodution"
        }
      }
  ]
}