import {
  AddItem,
  AddItemModel,
  AddItemRepository,
  ItemModel
} from './db-add-items-protocols'

export class DbAddItemRepository implements AddItem {
  constructor (
    private readonly addItemRepository: AddItemRepository
  ) {}

  async add (item: AddItemModel): Promise<ItemModel> {
    const newItem = await this.addItemRepository.addNewItem(item)
    return newItem
  }
}
