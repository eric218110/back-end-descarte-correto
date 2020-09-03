import { AddPoint } from '@domain/usecases/point/add-point'
import { AddPointModelData, PointModelData } from '@data/models/point-model'
import { AddPointRepository } from '@data/protocols/data/point/add-point-repository'

export class DbAddPoint implements AddPoint {
  constructor(private readonly addPointRepository: AddPointRepository) {}

  async add(addPoint: AddPointModelData): Promise<PointModelData> {
    await this.addPointRepository.addNewPoint(addPoint)
    return null
  }
}
