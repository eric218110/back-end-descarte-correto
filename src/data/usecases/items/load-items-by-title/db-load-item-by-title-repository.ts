import { LoadItemByTitleRepository } from '@data/protocols/data/items/load-item-by-title-repository'
import { ItemModel } from '../add-items/db-add-items-protocols'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'

export class DbLoadItemByTitleRepository implements LoadItemByTitle {
  constructor (
    private readonly loadItemByTitleRepository: LoadItemByTitleRepository
  ) {}

  async load (title: any): Promise<ItemModel> {
    const item = await this.loadItemByTitleRepository.loadByTitle(title)
    return item
  }
}
