import {
  LoadItemsModel,
  LoadItems,
  LoadItemsRepository
} from './db-load-items-protocols'

export class DbLoadItemsRepository implements LoadItems {
  constructor (
    private readonly loadItemsRepository: LoadItemsRepository
  ) {}

  async load (): Promise<LoadItemsModel[]> {
    const listItems = await this.loadItemsRepository.loadAllItems()
    return listItems
  }
}
