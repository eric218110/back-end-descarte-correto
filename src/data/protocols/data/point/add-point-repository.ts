import { AddPointModelData, PointModelData } from '@data/models/point-model'

export interface AddPointRepository {
  addNewPoint: (point: AddPointModelData) => Promise<PointModelData>
}
