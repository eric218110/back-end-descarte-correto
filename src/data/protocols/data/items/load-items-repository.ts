import { LoadItemsModel } from '@domain/usecases/item/load-items'

export interface LoadItemsRepository {
  loadAllItems: () => Promise<LoadItemsModel[]>
}
