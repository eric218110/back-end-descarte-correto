import { PointModel } from '@domain/models/point'

export interface LoadPointByIdRepository {
  loadById: (id: string) => Promise<PointModel>
}
