import { LoadPointById } from '@domain/usecases/point/load-point-by-id'
import { PointModel } from '@domain/models/point'
import { LoadPointByIdRepository } from '@data/protocols/data/point/load-point-by-id-repository'

export class DbLoadPointById implements LoadPointById {
  constructor(
    private readonly loadPointByIdRepository: LoadPointByIdRepository
  ) {}

  async load(id: string): Promise<PointModel> {
    const point = await this.loadPointByIdRepository.loadById(id)
    return point
  }
}
