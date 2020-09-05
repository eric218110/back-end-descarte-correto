import { ItemModel } from '@domain/models/item'

export interface LoadItemsByIdsRepository {
  loadItemsByIds: (idsItems: string[]) => Promise<ItemModel[]>
}
