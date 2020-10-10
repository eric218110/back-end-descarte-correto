import { AddPointRepository } from '@data/protocols/data/point/add-point-repository'
import { AddPointModelData, PointModelData } from '@data/models/point-model'
import { Repository, getRepository, getConnection } from 'typeorm'
import { EntityPoint } from '../../entities/point.entity'
import { EntityItem } from '../../entities/item.entity'
import { EntityAccount } from '../../entities/account.entity'
import { LoadPointByIdRepository } from '@data/protocols/data/point/load-point-by-id-repository'
import { LoadPointsRepository } from '@data/protocols/data/point/load-points-repositoty'
import { LoadPointsModel } from '@domain/usecases/point/load-points'
import { FilterPointsByItemsRepository } from '@data/protocols/data/point/filter-points-repositoty'
import { PointModel } from '@domain/models/point'

export class PointTypeOrmRepository
  implements
    AddPointRepository,
    LoadPointByIdRepository,
    LoadPointsRepository,
    FilterPointsByItemsRepository {
  private readonly pointTypeOrmRepository: Repository<EntityPoint>
  private readonly itemTypeOrmRepository: Repository<EntityItem>
  private readonly accountTypeOrmRepository: Repository<EntityAccount>

  constructor() {
    this.pointTypeOrmRepository = getRepository(EntityPoint)
    this.itemTypeOrmRepository = getRepository(EntityItem)
    this.accountTypeOrmRepository = getRepository(EntityAccount)
  }

  async addNewPoint(point: AddPointModelData): Promise<PointModelData> {
    const accountExist = await this.accountTypeOrmRepository.findOne({
      id: point.account.id
    })

    if (!accountExist) return null

    if (point.items.length === 0) return null
    const itemsExist = await this.itemTypeOrmRepository.findByIds(
      point.items.map(item => item.id)
    )
    if (itemsExist.length !== point.items.length) return null

    const createPoint = this.pointTypeOrmRepository.create(point)
    const savePoint = await this.pointTypeOrmRepository.save(createPoint)
    return savePoint
  }

  async loadById(id: string): Promise<PointModelData> {
    const point = await this.pointTypeOrmRepository.findOne({
      relations: ['account', 'items'],
      where: { id }
    })
    return point || null
  }

  async loadAll(): Promise<LoadPointsModel[]> {
    const points = await this.pointTypeOrmRepository.find({
      relations: ['account', 'items']
    })
    if (points) {
      points.map(point => {
        delete point.account.password
        delete point.account.role
        delete point.account.accessToken
      })
      return points
    }
  }

  async filterByItemsIds(itemsIds: string[]): Promise<PointModel[]> {
    if (itemsIds.length === 0) return []
    const pointsMap: EntityPoint[] = []
    const points = await getConnection().query(
      `
      SELECT 
      DISTINCT 
      "point"."id" AS "point_id", 
      "point"."name" AS "point_name", 
      "point"."image" AS "point_image", 
      "point"."latitude" AS "point_latitude", 
      "point"."longitude" AS "point_longitude", 
      "point"."city" AS "point_city", 
      "point"."state" AS "point_state", 
      "point"."neighborhood" AS "point_neighborhood", 
      "point"."reference" AS "point_reference", 
      "point"."street" AS "point_street", 
      "point"."zipCode" AS "point_zipCode", 
      "point"."accountId" AS "point_accountId", 
      "item"."id" AS "item_id", 
      "item"."image" AS "item_image", 
      "item"."activeColor" AS "item_activeColor", 
      "item"."color" AS "item_color", 
      "item"."title" AS "item_title", 
      "account"."id" AS "account_id", 
      "account"."name" AS "account_name", 
      "account"."email" AS "account_email", 
      "account"."password" AS "account_password", 
      "account"."accessToken" AS "account_accessToken", 
      "account"."role" AS "account_role" 
      FROM "point" "point" 
      LEFT JOIN "point_items_item" "point_item" ON "point_item"."pointId"="point"."id" 
      LEFT JOIN "item" "item" ON "item"."id"="point_item"."itemId"  
      LEFT JOIN "account" "account" ON "account"."id"="point"."accountId" 
      WHERE "point_item"."itemId" IN (${itemsIds
        .map(point => `'${point}'`)
        .join()})
    `
    )
    points.map((point: any) => {
      pointsMap.push({
        account: {
          id: point.account_id,
          name: point.account_name,
          email: point.account_email,
          password: point.account_password,
          accessToken: point.account_accessToken,
          role: point.account_role
        },
        items: [
          {
            id: point.item_id,
            activeColor: point.item_activeColor,
            color: point.item_color,
            image: point.item_image,
            title: point.item_title
          }
        ],
        id: point.point_id,
        name: point.point_name,
        image: point.point_image,
        latitude: point.point_latitude,
        longitude: point.point_longitude,
        city: point.point_city,
        state: point.point_state,
        neighborhood: point.point_neighborhood,
        reference: point.point_reference,
        street: point.point_street,
        zipCode: point.point_zipCode
      })
    })
    return pointsMap
  }
}
