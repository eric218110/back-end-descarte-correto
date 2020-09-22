import { LoadPoints } from '@domain/usecases/point/load-points'
import { DbLoadPoints } from '@data/usecases/point/load-points/db-load-points'
import { PointTypeOrmRepository } from '@infra/db/typeorm/repositories/point/point-typeorm-repository'

export const makeDbLoadPoints = (): LoadPoints => {
  const LoadPointsRepository = new PointTypeOrmRepository()
  return new DbLoadPoints(LoadPointsRepository)
}
