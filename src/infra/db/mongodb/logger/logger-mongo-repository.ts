import { LoggerErrorRepository } from '../../../../data/protocols/data/logger/logger-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoggerMongoRepository implements LoggerErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
