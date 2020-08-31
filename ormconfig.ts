import { ConnectionOptions } from 'typeorm'
import { resolve } from 'path'
import env from './src/main/config/env'

const DATABASE_TYPE = 'postgres'
const DATABASE_ENTITIES = [resolve('src', 'infra', 'db', 'typeorm', 'entities', '*.entity.ts')]

const connectionTest: ConnectionOptions = {
  type: 'sqlite',
  database: resolve('__test__', 'database', 'test.sqlite'),
  synchronize: true,
  logging: true,
  dropSchema: true,
  entities: DATABASE_ENTITIES
}

const connectionDevelopment: ConnectionOptions = {
  name: 'default',
    type: DATABASE_TYPE,
    database: env.TYPEORM_DATABASE,
    host: env.TYPEORM_HOST,
    port: env.TYPEORM_PORT,
    username: env.TYPEORM_USER,
    password: env.TYPEORM_PASSWORD,
    entities: DATABASE_ENTITIES,
    synchronize: true,
}

const connectionOptions = (process.env.MODE === 'test') ? connectionTest : connectionDevelopment

export = connectionOptions
