import { DbAddPoint } from '@data/usecases/point/add-point/db-add-point'
import { PointTypeOrmRepository } from '@infra/db/typeorm/repositories/point/point-typeorm-repository'
import { AddPoint } from '@domain/usecases/point/add-point'

export const makeDbAddPoint = (): AddPoint => {
  const addPointTypOrmRepository = new PointTypeOrmRepository()
  return new DbAddPoint(addPointTypOrmRepository)
}
