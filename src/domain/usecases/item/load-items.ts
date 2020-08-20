import { ItemModel } from '@domain/models/item'

export type LoadItemsModel = Omit<ItemModel, 'id'>

export interface LoadItems {
  load: () => Promise<LoadItemsModel[]>
}
