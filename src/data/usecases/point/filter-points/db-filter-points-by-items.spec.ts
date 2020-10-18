import { PointModelData } from '@data/models/point-model'
import { FilterPointsByItemsRepository } from '@data/protocols/data/point/filter-points-repositoty'
import { DbFilterPointByItems } from './db-filter-points-by-items'

type SutTypes = {
  sut: DbFilterPointByItems
  filterPointsByItemsRepositoryStub: FilterPointsByItemsRepository
}

const fakeResultPoint = (fakeId: string): PointModelData => ({
  account: {
    id: `any_accounnt_id_id:${fakeId}`,
    name: `any_accounnt_name_id:${fakeId}`,
    email: `any_accounnt_email_id:${fakeId}`,
    password: `any_accounnt_password_id:${fakeId}`,
    accessToken: `any_accounnt_accessToken_id:${fakeId}`,
    role: `any_accounnt_role_id:${fakeId}`
  },
  items: [
    {
      id: `any_first_item_id_id:${fakeId}`,
      description: `any_description_item_id:${fakeId}`,
      title: `any_first_item_title_id:${fakeId}`,
      activeColor: `any_activeColor_id:${fakeId}`,
      color: `any_color`
    },
    {
      id: `any_second_item_id_id:${fakeId}`,
      description: `any_description_item_id:${fakeId}`,
      title: `any_second_item_title_id:${fakeId}`,
      activeColor: `any_activeColor_id:${fakeId}`,
      color: `any_color`
    }
  ],
  id: `any_point_id_id:${fakeId}`,
  city: `any_point_city_id:${fakeId}`,
  image: `any_point_image_id:${fakeId}`,
  latitude: `any_point_latitude_id:${fakeId}`,
  longitude: `any_point_longitude_id:${fakeId}`,
  name: `any_point_name_id:${fakeId}`,
  neighborhood: `any_neighborhood_id:${fakeId}`,
  reference: `any_reference_id:${fakeId}`,
  street: `any_street_id:${fakeId}`,
  zipCode: `any_zipCode_id:${fakeId}`,
  state: `any_point_state_id:${fakeId}`
})

const fakeListPointsResult = (): PointModelData[] => {
  const arrayIds = ['1', '2']
  return arrayIds.map(value => fakeResultPoint(value))
}

const makeFilterPointsByItemsRepositoryStub = (): FilterPointsByItemsRepository => {
  class FilterPointsByItemsRepositoryStub
    implements FilterPointsByItemsRepository {
    async filterByItemsIds(itemsIds: string[]): Promise<PointModelData[]> {
      return new Promise(resolve => resolve(fakeListPointsResult()))
    }
  }
  return new FilterPointsByItemsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const filterPointsByItemsRepositoryStub = makeFilterPointsByItemsRepositoryStub()
  const sut = new DbFilterPointByItems(filterPointsByItemsRepositoryStub)
  return {
    filterPointsByItemsRepositoryStub,
    sut
  }
}

describe('DbFilterPointByItems', () => {
  describe('FilterPointsByItemsRepository', () => {
    test('should call FilterPointsByItemsRepository with correct values', async () => {
      const { sut, filterPointsByItemsRepositoryStub } = makeSut()
      const filterPointsByItemsRepositorySpy = jest.spyOn(
        filterPointsByItemsRepositoryStub,
        'filterByItemsIds'
      )
      const fakeIds = ['any_id_item', 'any_id_item_2']
      await sut.filter(fakeIds)
      expect(filterPointsByItemsRepositorySpy).toHaveBeenLastCalledWith(fakeIds)
    })

    test('should return [] if FilterPointsByItemsRepository return []', async () => {
      const { sut, filterPointsByItemsRepositoryStub } = makeSut()
      jest
        .spyOn(filterPointsByItemsRepositoryStub, 'filterByItemsIds')
        .mockReturnValueOnce(new Promise(resolve => resolve([])))
      const fakeIds = ['any_id_item', 'any_id_item_2']
      const points = await sut.filter(fakeIds)
      expect(points).toEqual([])
    })

    test('should return list[] if FilterPointsByItemsRepository success', async () => {
      const { sut } = makeSut()
      const fakeIds = ['any_id_item', 'any_id_item_2']
      const points = await sut.filter(fakeIds)
      expect(points).toEqual(fakeListPointsResult())
    })

    test('should throws if LoadPointByIdRepository throws', async () => {
      const { sut, filterPointsByItemsRepositoryStub } = makeSut()
      jest
        .spyOn(filterPointsByItemsRepositoryStub, 'filterByItemsIds')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )
      const fakeIds = ['any_id_item', 'any_id_item_2']
      const response = sut.filter(fakeIds)
      await expect(response).rejects.toThrow()
    })
  })
})
