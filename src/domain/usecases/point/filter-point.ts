import { PointModel } from '@domain/models/point'

export interface FilterPoint {
  filter: (itemsIds: string[]) => Promise<PointModel[]>
}
