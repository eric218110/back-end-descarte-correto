const autoImportPaths = require('./babel-auto-import-paths')

module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: [
      ['module-resolver', {
        alias: autoImportPaths()
      }],
      "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ],
    ignore: [
      '**/*.spec.ts',
      '**/*.test.ts'
    ]
  }