import { Collection } from 'mongodb'
import { ItemMongoRepository } from './item-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { ItemModel } from '@domain/models/item'
import { LoadItemsModel } from '@domain/usecases/item/load-items'

let itemsColletction: Collection<Omit<ItemModel, 'id'>>

interface SutTypes {
  sut: ItemMongoRepository
  itemsFake: LoadItemsModel[]
}

const makeLoadItemsFake = (): LoadItemsModel[] => ([
  { image: 'http://any_image_1.com', title: 'any_title_1' },
  { image: 'http://any_image_2.com', title: 'any_title_2' }
])

const makeSut = (): SutTypes => {
  const sut = new ItemMongoRepository()
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

describe('ItemMongoRepository', () => {
  describe('LoadAllItems()', () => {
    test('should load all items on sucess', async () => {
      const { sut, itemsFake } = makeSut()
      await itemsColletction.insertMany(itemsFake)
      const items = await sut.loadAllItems()
      expect(items.length).toBe(2)
      expect(items[0].title).toBe(itemsFake[0].title)
      expect(items[1].title).toBe(itemsFake[1].title)
    })

    test('should ItemMongoRepository return [] if is empty', async () => {
      const { sut } = makeSut()
      const items = await sut.loadAllItems()
      expect(items.length).toBe(0)
    })

    test('should return new item if add item on sucess', async () => {
      const { sut, itemsFake } = makeSut()
      const item = await sut.addNewItem(itemsFake[0])
      expect(item).toBeTruthy()
      expect(item.id).toBeTruthy()
      expect(item.title).toBe(itemsFake[0].title)
      expect(item.image).toBe(itemsFake[0].image)
    })

    test('should add only one item', async () => {
      const { sut, itemsFake } = makeSut()
      await sut.addNewItem(itemsFake[0])
      const itemExist = await itemsColletction.find({ title: itemsFake[0].title }).toArray()
      expect(itemExist.length).toBe(1)
    })

    test('should return null if title already exists', async () => {
      const { sut, itemsFake } = makeSut()
      await itemsColletction.insertOne({ title: itemsFake[0].title, image: itemsFake[1].image })
      const newItem = await sut.addNewItem(itemsFake[0])
      expect(newItem).toBeNull()
    })
  })

  describe('LoadItemByToken', () => {
    test('should return one item if title is equals', async () => {
      const { sut, itemsFake } = makeSut()
      await itemsColletction.insertMany(itemsFake)
      const item = await sut.loadByTitle(itemsFake[0].title)
      expect(item).toBeTruthy()
      expect(item.id).toBeTruthy()
      expect(item.title).toBe(itemsFake[0].title)
      expect(item.image).toBe(itemsFake[0].image)
    })
  })
})
