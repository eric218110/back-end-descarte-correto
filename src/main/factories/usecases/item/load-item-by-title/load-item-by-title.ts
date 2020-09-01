import { DbLoadItemByTitleRepository } from '@data/usecases/items/load-items-by-title/db-load-item-by-title-repository'
import { ItemTypeOrmRepository } from '@infra/db/typeorm/repositories/item/item-typeorm-repository'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'

export const makeLoadItemByTitle = (): LoadItemByTitle => {
  const loadItemTypOrmRepository = new ItemTypeOrmRepository()
  return new DbLoadItemByTitleRepository(loadItemTypOrmRepository)
}
