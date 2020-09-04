import { ItemModel } from '@domain/models/item'

export interface LoadItemByIdsRepository {
  loadItems: (idsItems: string[]) => Promise<ItemModel[]>
}
