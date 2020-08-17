import { ItemMongoRepositoty } from './item-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { ItemModel } from '@domain/models/item'
import { Collection } from 'mongodb'
import { LoadItemsModel } from '@domain/usecases/load-items'

let itemsColletction: Collection<Omit<ItemModel, 'id'>>

interface SutTypes {
  sut: ItemMongoRepositoty
  itemsFake: LoadItemsModel[]
}

const makeLoadItemsFake = (): LoadItemsModel[] => ([
  { image: 'http://any_image_1.com', title: 'any_title_1' },
  { image: 'http://any_image_2.com', title: 'any_title_2' }
])

const makeSut = (): SutTypes => {
  const sut = new ItemMongoRepositoty()
  const itemsFake = makeLoadItemsFake()
  return {
    sut,
    itemsFake
  }
}

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})
afterAll(async () => {
  await MongoHelper.disconnect()
})
beforeEach(async () => {
  itemsColletction = await MongoHelper.getCollection('items')
  await itemsColletction.deleteMany({})
})

describe('LoadAllItems()', () => {
  test('should load all items on sucess', async () => {
    const { sut, itemsFake } = makeSut()
    await itemsColletction.insertMany(itemsFake)
    const items = await sut.loadAllItems()
    expect(items.length).toBe(2)
    expect(items[0].title).toBe(itemsFake[0].title)
    expect(items[1].title).toBe(itemsFake[1].title)
  })

  test('should ItemMongoRepositoty return [] if is empty', async () => {
    const { sut } = makeSut()
    const items = await sut.loadAllItems()
    expect(items.length).toBe(0)
  })
})
