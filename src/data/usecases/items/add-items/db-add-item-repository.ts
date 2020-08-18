import { AddItem, AddItemModel } from '@domain/usecases/add-item'
import { ItemModel } from '@domain/models/item'
import { AddItemRepository } from '@data/protocols/items/add-items-repository'

export class DbAddItemRepository implements AddItem {
  constructor (
    private readonly addItemRepository: AddItemRepository
  ) {}

  async add (item: AddItemModel): Promise<ItemModel> {
    const newItem = await this.addItemRepository.addNewItem(item)
    return newItem
  }
}
