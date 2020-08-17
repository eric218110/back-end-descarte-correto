import { LoadItemsModel } from '@domain/usecases/load-items'

export interface LoadItemsRepository {
  loadAllItems: () => Promise<LoadItemsModel[]>
}
