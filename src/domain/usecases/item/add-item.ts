import { ItemModel } from '@domain/models/item'

export type AddItemModel = Omit<ItemModel, 'id'>

export interface AddItem {
  add: (item: AddItemModel) => Promise<ItemModel>
}
