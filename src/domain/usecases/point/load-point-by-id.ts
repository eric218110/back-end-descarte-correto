import { PointModel } from '@domain/models/point'

export interface LoadPointById {
  load: (id: string) => Promise<PointModel>
}
