import { ItemModel } from '@domain/models/item'

export interface LoadItemsByIdsRepository {
  loadItems: (idsItems: string[]) => Promise<ItemModel[]>
}
