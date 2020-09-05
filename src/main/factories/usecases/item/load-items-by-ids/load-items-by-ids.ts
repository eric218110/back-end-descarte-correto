import { DbLoadItemsByIdsRepository } from '@data/usecases/items/load-items-by-ids/db-load-items-by-ids-repository'
import { ItemTypeOrmRepository } from '@infra/db/typeorm/repositories/item/item-typeorm-repository'
import { LoadItemByIds } from '@domain/usecases/item/load-items-by-ids'

export const makeLoadItemByIds = (): LoadItemByIds => {
  const loadItemTypOrmRepository = new ItemTypeOrmRepository()
  return new DbLoadItemsByIdsRepository(loadItemTypOrmRepository)
}
