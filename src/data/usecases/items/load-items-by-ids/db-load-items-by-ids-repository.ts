import {
  LoadItemsByIdsRepository,
  ItemModel
} from './db-load-items-by-ids-protocols'
import { LoadItemByIds } from '@domain/usecases/item/load-items-by-ids'

export class DbLoadItemsByIdsRepository implements LoadItemByIds {
  constructor(
    private readonly loadItemsByIdsRepository: LoadItemsByIdsRepository
  ) {}

  async load(idsItems: string[]): Promise<ItemModel[]> {
    if (idsItems.length === 0) return null
    const items = await this.loadItemsByIdsRepository.loadItemsByIds(idsItems)
    if (!items) return null
    return items
  }
}
