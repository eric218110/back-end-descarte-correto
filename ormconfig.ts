const path = require('path')
const pathMode = process.env.MODE === 'prodution' ? 'dist' : 'src'
const env = require('./'+ pathMode +'/main/config/env')

const DATABASE_ENTITIES = [path.resolve(
  pathMode, 'infra', 'db', 'typeorm', 'entities', '*.entity.*'
)]

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
  database: env.TYPEORM_DATABASE,
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  username: process.env.USER_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  entities: DATABASE_ENTITIES,
  synchronize: true,
  logging : ['error'],
}

const connectionProdution = {
  name: 'default',
  type: 'postgres',
  database: env.TYPEORM_DATABASE,
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  username: process.env.USER_DATABASE,
  password: process.env.PASSWORD_DATABASE,
  entities: DATABASE_ENTITIES,
  synchronize: true,
}

function getConnectionType() {
  if (process.env.MODE === 'test') return connectionTest
  if (process.env.MODE === 'development') return connectionDevelopment
  if (process.env.MODE === 'prodution') return connectionProdution
}

module.exports = getConnectionType()
