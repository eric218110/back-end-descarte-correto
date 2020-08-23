
import { ItemModel } from '@domain/models/item'

export interface LoadItemByTitleRepository {
  loadByTitle: (title: string) => Promise<ItemModel>
}
