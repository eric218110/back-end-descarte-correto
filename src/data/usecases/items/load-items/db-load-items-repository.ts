import { LoadItemsModel, LoadItems } from '@domain/usecases/load-items'
import { LoadItemsRepository } from '@data/protocols/items/load-items-repository'

export class DbLoadItemsRepository implements LoadItems {
  constructor (
    private readonly loadItemsRepository: LoadItemsRepository
  ) {}

  async load (): Promise<LoadItemsModel[]> {
    await this.loadItemsRepository.loadAllItems()
    return null
  }
}
