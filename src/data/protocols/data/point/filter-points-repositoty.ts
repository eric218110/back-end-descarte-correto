import { PointModelData } from '@data/models/point-model'

export interface FilterPointsByItemsRepository {
  filterByItemsIds: (itemsIds: string[]) => Promise<PointModelData[]>
}
