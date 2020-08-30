import { PointModel } from '@domain/models/point'

export type AddPointModel = Omit<PointModel, 'id'>

export interface AddPoint {
  add: (addPoint: AddPointModel) => Promise<PointModel>
}
