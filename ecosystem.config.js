const path = require('path')

module.exports = {
  apps : [
    {
      name: "back-end-tcc",
      script: path.resolve(__dirname, 'dist', 'main', 'server', 'index.js'),
      watch: ["dist"],
      watch_delay: 1000,
      ignore_watch : ["node_modules", "temp"],
      watch_options: {
        "followSymlinks": false
      }
    }
  ]
}