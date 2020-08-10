import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

const { mongoURL, port } = env

MongoHelper.connect(mongoURL).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(port, () => console.log(`Server running in port ${port}`))
}).catch(error => console.log(error))
