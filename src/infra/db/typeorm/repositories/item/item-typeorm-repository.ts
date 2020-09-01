import { Repository, getRepository } from 'typeorm'
import { AddItemRepository } from '@data/protocols/data/items/add-items-repository'
import { AddItemModelData, ItemModelData } from '@data/models/item-model'
import { EntityItem } from '../../entities/item.entity'

export class ItemTypeOrmRepository implements AddItemRepository {
  private readonly itemTypeOrmRepository: Repository<EntityItem>

  constructor () {
    this.itemTypeOrmRepository = getRepository(EntityItem)
  }

  async addNewItem (addItem: AddItemModelData): Promise<ItemModelData> {
    const item = this.itemTypeOrmRepository.create(addItem)
    return await this.itemTypeOrmRepository.save(item) || null
  }
}
