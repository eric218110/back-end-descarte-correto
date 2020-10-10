import { DbFilterPointByItems } from '@data/usecases/point/filter-points/db-filter-points-by-items'
import { PointTypeOrmRepository } from '@infra/db/typeorm/repositories/point/point-typeorm-repository'
import { FilterPoint } from '@domain/usecases/point/filter-point'

export const makeFilterPoints = (): FilterPoint => {
  const filterPointByIdRepository = new PointTypeOrmRepository()
  return new DbFilterPointByItems(filterPointByIdRepository)
}
