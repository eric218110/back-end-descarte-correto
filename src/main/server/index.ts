// import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'

const { PORT, MODE } = env

// MongoHelper.connect(MONGO_DB_URL).then(async () => {
//   const app = (await import('../config/app')).default
//   app.listen(PORT, () => console.log(`Server running in port ${PORT} - MODE: ${MODE}`))
// }).catch(error => console.log(error))

// async function bootstrap (): Promise<void> {
//   const connection = await connectionDatabase.create()
//   const app = (await import('../config/app')).default
//   app.listen(PORT, () => console.log(`Server running in port ${PORT} - MODE: ${MODE}`))
// }

// eslint-disable-next-line @typescript-eslint/no-floating-promises
connectionDatabase.create().then(async () => {
  const app = (await import('../config/app')).default
  app.listen(PORT, () => console.log(`Server running in port ${PORT} - MODE: ${MODE}`))
}).catch(error => console.error(error))
