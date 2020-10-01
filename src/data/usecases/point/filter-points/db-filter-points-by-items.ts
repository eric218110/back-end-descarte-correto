import { PointModel } from '@domain/models/point'
import { FilterPoint } from '@domain/usecases/point/filter-point'
import { FilterPointsByItemsRepository } from '@data/protocols/data/point/filter-points-repositoty'

export class DbFilterPointByItems implements FilterPoint {
  constructor(
    private readonly filterPointsByItemsRepository: FilterPointsByItemsRepository
  ) {}

  async filter(itemsIds: string[]): Promise<PointModel[]> {
    const pointsFiltes = await this.filterPointsByItemsRepository.filterByItemsIds(
      itemsIds
    )
    if (pointsFiltes.length === 0) return []
    return new Promise(resolve => resolve(null))
  }
}
