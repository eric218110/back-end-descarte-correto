import { LoadPointsRepository } from '@data/protocols/data/point/load-points-repositoty'
import { LoadPoints, LoadPointsModel } from '@domain/usecases/point/load-points'

export class DbLoadPoints implements LoadPoints {
  constructor(private readonly loadPointsRepository: LoadPointsRepository) {}

  async load(): Promise<LoadPointsModel[]> {
    await this.loadPointsRepository.loadAll()
    return null
  }
}
