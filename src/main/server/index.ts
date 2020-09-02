import 'reflect-metadata'
import env from '../config/env'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'

const { PORT, MODE } = env

connectionDatabase.create().then(async () => {
  const app = (await import('../config/app')).default
  app().listen(PORT, () => console.log(`Server running in port ${PORT} - MODE: ${MODE}`))
}).catch(error => console.error(error))
