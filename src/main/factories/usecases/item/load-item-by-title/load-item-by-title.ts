import { DbLoadItemByTitleRepository } from '@data/usecases/items/load-items-by-title/db-load-item-by-title-repository'
import { ItemMongoRepository } from '@infra/db/mongodb/item/item-mongo-repository'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'

export const makeLoadItemByTitle = (): LoadItemByTitle => {
  const loadItemMongoRepository = new ItemMongoRepository()
  return new DbLoadItemByTitleRepository(loadItemMongoRepository)
}
