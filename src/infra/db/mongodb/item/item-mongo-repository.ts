import { LoadItemsRepository } from '@data/protocols/data/items/load-items-repository'
import { LoadItemsModel } from '@domain/usecases/item/load-items'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddItemRepository } from '@data/protocols/data/items/add-items-repository'
import { ItemModel } from '@domain/models/item'
import { AddItemModel } from '@domain/usecases/item/add-item'
import { LoadItemByTitleRepository } from '@data/protocols/data/items/load-item-by-title-repository'

export class ItemMongoRepository
implements AddItemRepository, LoadItemsRepository, LoadItemByTitleRepository {
  async loadAllItems (): Promise<LoadItemsModel[]> {
    const itemsCollection = await MongoHelper.getCollection('items')
    const items = await itemsCollection.find().toArray()
    return items
  }

  async addNewItem (addItem: AddItemModel): Promise<ItemModel> {
    const itemCollection = await MongoHelper.getCollection('items')
    const itemExist = await itemCollection.findOne({ title: addItem.title })
    if (!itemExist) {
      const result = await itemCollection.insertOne(addItem)
      const newItem = result.ops[0]
      return MongoHelper.collectionWithoutId<ItemModel>(newItem)
    }
    return null
  }

  async loadByTitle (title: string): Promise<ItemModel> {
    const itemCollection = await MongoHelper.getCollection('items')
    const item = await itemCollection.findOne({ title })
    return item && MongoHelper.collectionWithoutId<ItemModel>(item)
  }
}
