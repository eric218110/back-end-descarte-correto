const path = require('path')
const pathMode = process.env.MODE === 'production' ? 'dist' : 'src'
const env = require('./'+ pathMode +'/main/config/env')

const DATABASE_ENTITIES = [path.resolve(
  pathMode, 'infra', 'db', 'typeorm', 'entities', '*.entity.*'
)]

const modeConnection = {
  TEST:"test",
  DEVELOPMENT:"development",
  PRODUCTION:"production"
}

const connectionTest = {
  type: 'sqlite',
  database: path.resolve('__test__', 'database', 'test.sqlite'),
  synchronize: true,
  logging : true,
  dropSchema: true,
  entities: DATABASE_ENTITIES
}

const connectionDevelopment = {
  name: 'default',
  type: 'postgres',
  database: process.env.DATABASE,
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  username: process.env.USER_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  entities: DATABASE_ENTITIES,
  synchronize: true,
  logging : ['error'],
}

const connectionProduction = {
  name: 'default',
  type: 'postgres',
  database: process.env.DATABASE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.USER_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  entities: DATABASE_ENTITIES,
  synchronize: true,
}

function getConnectionType() {
  if (process.env.MODE === modeConnection.TEST) return connectionTest
  if (process.env.MODE === modeConnection.DEVELOPMENT) return connectionDevelopment
  if (process.env.MODE === modeConnection.PRODUCTION) return connectionProduction
}

module.exports = getConnectionType()
