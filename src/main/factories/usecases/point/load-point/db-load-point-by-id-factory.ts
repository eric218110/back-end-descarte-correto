import { LoadPointById } from '@domain/usecases/point/load-point-by-id'
import { DbLoadPointById } from '@data/usecases/point/load-point-by-id/db-load-point-by-id'
import { PointTypeOrmRepository } from '@infra/db/typeorm/repositories/point/point-typeorm-repository'

export const makeDbLoadPointById = (): LoadPointById => {
  const loadPointByIdRepository = new PointTypeOrmRepository()
  return new DbLoadPointById(loadPointByIdRepository)
}
