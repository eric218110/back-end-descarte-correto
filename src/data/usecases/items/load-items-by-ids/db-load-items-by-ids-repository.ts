import {
  LoadItemsByIdsRepository,
  ItemModel
} from './db-load-items-by-ids-protocols'

export class DbLoadItemsByIdsRepository implements LoadItemsByIdsRepository {
  constructor(
    private readonly loadItemsByIdsRepository: LoadItemsByIdsRepository
  ) {}

  async loadItems(idsItems: string[]): Promise<ItemModel[]> {
    if (idsItems.length === 0) return null
    const items = await this.loadItemsByIdsRepository.loadItems(idsItems)
    if (!items) return null
    return items
  }
}
