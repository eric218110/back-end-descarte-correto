import { LoadPointsModelData } from '@data/models/point-model'

export interface LoadPointsRepository {
  loadAll: () => Promise<LoadPointsModelData[]>
}
