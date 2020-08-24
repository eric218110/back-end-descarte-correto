import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'

const { MONGO_DB_URL, PORT } = env

MongoHelper.connect(MONGO_DB_URL).then(async () => {
  const app = (await import('../config/app')).default
  app.listen(PORT, () => console.log(`Server running in port ${PORT}`))
}).catch(error => console.log(error))
