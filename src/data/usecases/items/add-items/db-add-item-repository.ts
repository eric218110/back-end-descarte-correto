import { AddItem, AddItemModel } from '@domain/usecases/add-item'
import { ItemModel } from '@domain/models/item'
import { AddItemRepository } from '@data/protocols/items/add-items-repository'

export class DbAddtemRepository implements AddItem {
  constructor (
    private readonly addItemRepository: AddItemRepository
  ) {}

  async add (item: AddItemModel): Promise<ItemModel> {
    await this.addItemRepository.addNewItem(item)
    return null
  }
}
