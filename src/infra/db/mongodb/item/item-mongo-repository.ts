import { LoadItemsRepository } from '@data/protocols/data/items/load-items-repository'
import { LoadItemsModel } from '@domain/usecases/load-items'
import { MongoHelper } from '../helpers/mongo-helper'

export class ItemMongoRepositoty implements LoadItemsRepository {
  async loadAllItems (): Promise<LoadItemsModel[]> {
    const itemsCollection = await MongoHelper.getCollection('items')
    const items = await itemsCollection.find().toArray()
    return items
  }
}
