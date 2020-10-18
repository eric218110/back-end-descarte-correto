import {
  Repository,
  EntityItem,
  ItemTypeOrmRepository,
  LoadItemsModelData,
  connectionDatabase
} from './item-typeorm-repository-protocols'
import { ItemModelData } from '@data/models/item-model'

let itemTypeOrmRepository: Repository<EntityItem>

interface SutTypes {
  sut: ItemTypeOrmRepository
  itemsFake: LoadItemsModelData
}

const makeLoadItemsFake = (): LoadItemsModelData => [
  {
    title: 'any_title_1',
    description: 'Description Item',
    activeColor: 'active_color',
    color: 'color'
  },
  {
    title: 'any_title_2',
    description: 'Description Item',
    activeColor: 'active_color',
    color: 'color'
  }
]

const fakeItems: ItemModelData[] = [
  {
    id: 'd968e70a-7493-4221-acaa-5225bf2be130',
    description: 'Description Item',
    title: 'Any title image 1',
    activeColor: 'activeColor',
    color: 'color'
  },
  {
    id: '6bf16e68-cf14-4b82-a357-4b24774e5d98',
    description: 'Description Item',
    title: 'Any title image 2',
    activeColor: 'activeColor',
    color: 'color'
  }
]

const makeSut = (): SutTypes => {
  const sut = new ItemTypeOrmRepository()
  const itemsFake = makeLoadItemsFake()
  return {
    sut,
    itemsFake
  }
}

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  itemTypeOrmRepository = connection.getRepository(EntityItem)
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('ItemTypeOrmRepository', () => {
  describe('AddNewItem', () => {
    test('should add only one item', async () => {
      const { sut, itemsFake } = makeSut()
      await sut.addNewItem(itemsFake[0])
      const itemExist = await itemTypeOrmRepository.find({
        title: itemsFake[0].title
      })
      expect(itemExist.length).toBe(1)
    })
    test('should return null if title already exists', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert({
        title: itemsFake[0].title,
        description: itemsFake[1].description,
        activeColor: itemsFake[1].activeColor,
        color: itemsFake[1].color
      })
      const newItem = await sut.addNewItem(itemsFake[0])
      expect(newItem).toBeNull()
    })
  })

  describe('LoadAllItems', () => {
    test('should load all items on sucess', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert(itemsFake)
      const items = await sut.loadAllItems()
      expect(items.length).toBe(2)
      expect(items[0].title).toBe(itemsFake[0].title)
      expect(items[1].title).toBe(itemsFake[1].title)
    })

    test('should ItemTypeOrmRepository return [] if is empty', async () => {
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
    })
  })

  describe('LoadItemByToken', () => {
    test('should return one item if title is equals', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert(itemsFake)
      const item = await sut.loadByTitle(itemsFake[0].title)
      expect(item).toBeTruthy()
      expect(item.id).toBeTruthy()
      expect(item.title).toEqual(itemsFake[0].title)
    })

    test('should return null if title is different', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert(itemsFake)
      const item = await sut.loadByTitle('not_exist_title')
      expect(item).toBeNull()
    })
  })

  describe('LoadItemsByIds', () => {
    test('should ItemTypeOrmRepository return list of items', async () => {
      await connectionDatabase.clear()
      const createFirstItem = itemTypeOrmRepository.create(fakeItems[0])
      const createSecondItem = itemTypeOrmRepository.create(fakeItems[1])
      await itemTypeOrmRepository.save(createFirstItem)
      await itemTypeOrmRepository.save(createSecondItem)
      const { sut } = makeSut()
      const item = await sut.loadItemsByIds([fakeItems[0].id, fakeItems[1].id])
      expect(item[0]).toEqual(fakeItems[1])
      expect(item[1]).toEqual(fakeItems[0])
    })

    test('should ItemTypeOrmRepository return null if one or more items not exist', async () => {
      const createFirstItem = itemTypeOrmRepository.create({
        id: 'c989d837-79ac-4f21-9e7a-a5889e0a59cf',
        description: 'Description Item',
        title: 'One Title',
        color: 'color',
        activeColor: 'activeColor'
      })
      const firstItem = await itemTypeOrmRepository.save(createFirstItem)
      const { sut } = makeSut()
      const item = await sut.loadItemsByIds([firstItem.id, 'invalid_id_item'])
      expect(item).toBeNull()
    })
  })
})
