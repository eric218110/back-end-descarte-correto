import { DbAddItemRepository } from '@data/usecases/items/add-items/db-add-item-repository'
import { ItemTypeOrmRepository } from '@infra/db/typeorm/repositories/item/item-typeorm-repository'
import { AddItem } from '@domain/usecases/item/add-item'

export const makeDbAddItem = (): AddItem => {
  const loadItemsTypOrmRepository = new ItemTypeOrmRepository()
  return new DbAddItemRepository(loadItemsTypOrmRepository)
}
