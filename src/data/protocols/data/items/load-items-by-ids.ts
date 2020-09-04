import { ItemModel } from '@domain/models/item'

export interface LoadItemByIds {
  loadItems: (idsItems: string[]) => Promise<ItemModel[]>
}
