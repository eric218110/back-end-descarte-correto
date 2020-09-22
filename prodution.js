const { exec } = require("child_process");

const removeFile = [
  '.git',
  '.vscode',
  '__test__',
  'coverage',
  'docs',
  'src',
  'node_modules',
  'license',
  'tsconfig.json',
  '.editorconfig',
  '.eslintignore',
  '.eslintrc.json',
  '.gitignore',
  '.huskyrc.json',
  '.lintstagedrc.json',
  '.npmrc',
  '.travis.yml',
  'babel-auto-import-paths.js',
  'babel.config.js',
  'babel.config.js',
  'jest-integration-config.js',
  'jest-unit-config.js',
  'jest.config.js',
  'prettier.config.js',
  'readme.md',
  'tsconfig-build.json',
  'tsconfig',
  'yarn.lock', 
]

exec('yarn install', (error) => {
  console.log('\x1b[1m', `\x1b[34mBuild MODE PRODUTION \x1b[0m` ,'\x1b[0m');
  if(error) {
    console.log('\x1b[1m', `\x1b[31mERRO: ${error} \x1b[0m` ,'\x1b[0m');
  }else {
    const rimraf = require('rimraf')
    console.log('\x1b[1m', `\x1b[32mInstall dependencies: OK \x1b[0m` ,'\x1b[0m')
    exec('yarn build', (error, stdout, stderr) => {
      console.log(stdout);
      if(error) {
        console.log('\x1b[1m', `\x1b[31mERRO: ${error} \x1b[0m` ,'\x1b[0m');
      }else {
        console.log('\x1b[1m', `\x1b[32mProcess build: OK \x1b[0m` ,'\x1b[0m')
        removeFile.map(file => {
          rimraf(file, (error) => {
            if(error) {
              console.log('\x1b[1m', `\x1b[31mERRO: ${error} \x1b[0m` ,'\x1b[0m');
            }else {
              console.log('\x1b[1m', `\x1b[32mRemove ${file}: OK \x1b[0m` ,'\x1b[0m')
            }
          })
        })
        exec('yarn install --production=true', (error) => {
          console.log('\x1b[1m', `\x1b[32mInstalling production packages \x1b[0m` ,'\x1b[0m')
          if (error) {
            console.log('\x1b[1m', `\x1b[31mERRO: ${error} \x1b[0m` ,'\x1b[0m');
          } else {
            
          }
          console.log('\x1b[1m', `\x1b[34m----------------------------- \x1b[0m` ,'\x1b[0m')
          console.log('\x1b[1m', `\x1b[32mBuild complete :) \x1b[0m` ,'\x1b[0m')
          exec('pm2 start ecosystem.config.js', (error) => {
            console.log('\x1b[1m', `\x1b[32mServer Running with PM2 \x1b[0m` ,'\x1b[0m')
            console.log('\x1b[1m', `\x1b[32mDetails execute pm2 status or pm2 log \x1b[0m` ,'\x1b[0m')
          })
        })
      }
    })
  }
})
    