import { AddPointRepository } from '@data/protocols/data/point/add-point-repository'
import { AddPointModelData, PointModelData } from '@data/models/point-model'
import { Repository, getRepository } from 'typeorm'
import { EntityPoint } from '../../entities/point.entity'
import { EntityItem } from '../../entities/item.entity'
import { EntityAccount } from '../../entities/account.entity'

export class PointTypeOrmRepository implements AddPointRepository {
  private readonly pointTypeOrmRepository: Repository<EntityPoint>
  private readonly itemTypeOrmRepository: Repository<EntityItem>
  private readonly accountTypeOrmRepository: Repository<EntityAccount>

  constructor() {
    this.pointTypeOrmRepository = getRepository(EntityPoint)
    this.itemTypeOrmRepository = getRepository(EntityItem)
    this.accountTypeOrmRepository = getRepository(EntityAccount)
  }

  async addNewPoint(point: AddPointModelData): Promise<PointModelData> {
    const accountExist = await this.accountTypeOrmRepository.findOne({
      id: point.account.id
    })

    if (!accountExist) return null

    if (point.items.length === 0) return null
    const itemsExist = await this.itemTypeOrmRepository.findByIds(
      point.items.map(item => item.id)
    )
    if (itemsExist.length !== point.items.length) return null
  }
}
