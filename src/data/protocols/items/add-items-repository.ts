import { AddItemModel } from '@domain/usecases/add-item'
import { ItemModel } from '@domain/models/item'

export interface AddItemRepository {
  addNewItem: (addItem: AddItemModel) => Promise<ItemModel>
}
