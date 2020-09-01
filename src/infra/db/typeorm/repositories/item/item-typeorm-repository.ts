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

export class ItemTypeOrmRepository implements
AddItemRepository,
LoadItemsRepository,
LoadItemByTitleRepository {
  private readonly itemTypeOrmRepository: Repository<EntityItem>

  constructor () {
    this.itemTypeOrmRepository = getRepository(EntityItem)
  }

  async addNewItem (addItem: AddItemModelData): Promise<ItemModelData> {
    const itemExist = await this.itemTypeOrmRepository.findOne({ title: addItem.title })
    if (itemExist) return null
    const item = this.itemTypeOrmRepository.create(addItem)
    return await this.itemTypeOrmRepository.save(item) || null
  }

  async loadAllItems (): Promise<LoadItemsModelData> {
    return await this.itemTypeOrmRepository.find()
  }

  async loadByTitle (title: string): Promise<ItemModelData> {
    return await this.itemTypeOrmRepository.findOne({ title }) || null
  }
}
