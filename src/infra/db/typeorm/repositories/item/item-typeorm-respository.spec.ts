import {
  Repository,
  EntityItem,
  ItemTypeOrmRepository,
  LoadItemsModelData,
  connectionDatabase
} from './item-typeorm-repository-protocols'

let itemTypeOrmRepository: Repository<EntityItem>

interface SutTypes {
  sut: ItemTypeOrmRepository
  itemsFake: LoadItemsModelData
}

const makeLoadItemsFake = (): LoadItemsModelData => ([
  { image: 'http://any_image_1.com', title: 'any_title_1' },
  { image: 'http://any_image_2.com', title: 'any_title_2' }
])

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
      const itemExist = await itemTypeOrmRepository.find({ title: itemsFake[0].title })
      expect(itemExist.length).toBe(1)
    })
    test('should return null if title already exists', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert({ title: itemsFake[0].title, image: itemsFake[1].image })
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
  })

  describe('LoadItemByToken', () => {
    test('should return one item if title is equals', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert(itemsFake)
      const item = await sut.loadByTitle(itemsFake[0].title)
      expect(item).toBeTruthy()
      expect(item.id).toBeTruthy()
      expect(item.title).toEqual(itemsFake[0].title)
      expect(item.image).toEqual(itemsFake[0].image)
    })

    test('should return null if title is different', async () => {
      const { sut, itemsFake } = makeSut()
      await itemTypeOrmRepository.insert(itemsFake)
      const item = await sut.loadByTitle('not_exist_title')
      expect(item).toBeNull()
    })
  })
})
