import { Repository, getRepository } from 'typeorm'
import { AddItemRepository } from '@data/protocols/data/items/add-items-repository'
import { AddItemModelData, ItemModelData, LoadItemsModelData } from '@data/models/item-model'
import { EntityItem } from '../../entities/item.entity'
import { LoadItemsRepository } from '@data/protocols/data/items/load-items-repository'

export class ItemTypeOrmRepository implements
AddItemRepository,
LoadItemsRepository {
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
}
