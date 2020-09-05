import {
  Repository,
  getRepository,
  AddItemRepository,
  AddItemModelData,
  ItemModelData,
  LoadItemsModelData,
  EntityItem,
  LoadItemsRepository,
  LoadItemByTitleRepository
} from './item-typeorm-repository-protocols'
import { LoadItemsByIdsRepository } from '@data/protocols/data/items/load-items-by-ids-repository'

export class ItemTypeOrmRepository
  implements
    AddItemRepository,
    LoadItemsRepository,
    LoadItemByTitleRepository,
    LoadItemsByIdsRepository {
  private readonly itemTypeOrmRepository: Repository<EntityItem>

  constructor() {
    this.itemTypeOrmRepository = getRepository(EntityItem)
  }

  async addNewItem(addItem: AddItemModelData): Promise<ItemModelData> {
    const itemExist = await this.itemTypeOrmRepository.findOne({
      title: addItem.title
    })
    if (itemExist) return null
    const item = this.itemTypeOrmRepository.create(addItem)
    return (await this.itemTypeOrmRepository.save(item)) || null
  }

  async loadAllItems(): Promise<LoadItemsModelData> {
    return await this.itemTypeOrmRepository.find()
  }

  async loadByTitle(title: string): Promise<ItemModelData> {
    return (await this.itemTypeOrmRepository.findOne({ title })) || null
  }

  async loadItemsByIds(idsItems: string[]): Promise<ItemModelData[]> {
    const items = await this.itemTypeOrmRepository.findByIds(idsItems)
    if (idsItems.length === items.length) {
      return items
    }
    return null
  }
}
