import { ItemModel } from '@domain/models/item'

export interface LoadItemByIds {
  load: (idsItems: string[]) => Promise<ItemModel[]>
}
