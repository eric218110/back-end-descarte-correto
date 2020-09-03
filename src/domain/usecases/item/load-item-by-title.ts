import { ItemModel } from '@domain/models/item'

export interface LoadItemByTitle {
  load: (title: string) => Promise<ItemModel>
}
