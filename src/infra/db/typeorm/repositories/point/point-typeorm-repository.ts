import { AddPointRepository } from '@data/protocols/data/point/add-point-repository'
import { AddPointModelData, PointModelData } from '@data/models/point-model'
import { Repository, getRepository } from 'typeorm'
import { EntityPoint } from '../../entities/point.entity'

export class PointTypeOrmRepository implements AddPointRepository {
  private readonly pointTypeOrmRepository: Repository<EntityPoint>

  constructor() {
    this.pointTypeOrmRepository = getRepository(EntityPoint)
  }

  async addNewPoint(point: AddPointModelData): Promise<PointModelData> {
    const createPoint = this.pointTypeOrmRepository.create(point)
    const savePoint = await this.pointTypeOrmRepository.save(createPoint)
    return savePoint
  }
}
