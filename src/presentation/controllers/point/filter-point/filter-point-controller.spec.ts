import { FilterPoint } from '@domain/usecases/point/filter-point'
import {
  badRequest,
  noContent,
  ok
} from '@presentation/helper/http/http-helper'
import {
  HttpRequest,
  MissingParamsError,
  PointModel,
  serverError,
  Validator
} from '../add-point/add-point-controller-protocols'
import { FilterPointController } from './filter-point-controller'

type SutType = {
  sut: FilterPointController
  filterPointStub: FilterPoint
  validatorStub: Validator
}

const fakeResultPoint = (fakeId: string): PointModel => ({
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
      title: `any_first_item_title_id:${fakeId}`,
      description: `any_first_item_description_id:${fakeId}`,
      activeColor: `any_activeColor_id:${fakeId}`,
      color: `any_color`
    },
    {
      id: `any_second_item_id_id:${fakeId}`,
      title: `any_second_item_title_id:${fakeId}`,
      description: `any_first_item_description_id:${fakeId}`,
      activeColor: `any_activeColor_id:${fakeId}`,
      color: `any_color`
    }
  ],
  id: `any_point_id_id:${fakeId}`,
  city: `any_point_city_id:${fakeId}`,
  locationType: `any_point_locationType_id:${fakeId}`,
  image: `any_point_image_id:${fakeId}`,
  latitude: `any_point_latitude_id:${fakeId}`,
  longitude: `any_point_longitude_id:${fakeId}`,
  placeName: `any_point_placeName_id:${fakeId}`,
  neighborhood: `any_neighborhood_id:${fakeId}`,
  referencePoint: `any_referencePoint_id:${fakeId}`,
  street: `any_street_id:${fakeId}`,
  zipCode: `any_zipCode_id:${fakeId}`,
  state: `any_point_state_id:${fakeId}`
})

const fakeListPointsResult = (): PointModel[] => {
  const arrayIds = ['1', '2']
  return arrayIds.map(value => fakeResultPoint(value))
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeFilterPointStub = (): FilterPoint => {
  class FilterPointStub implements FilterPoint {
    async filter(idItem: string[]): Promise<PointModel[]> {
      return new Promise(resolve => resolve(fakeListPointsResult()))
    }
  }
  return new FilterPointStub()
}

const makeSut = (): SutType => {
  const filterPointStub = makeFilterPointStub()
  const validatorStub = makeValidatorStub()
  const sut = new FilterPointController(filterPointStub, validatorStub)
  return {
    sut,
    filterPointStub,
    validatorStub
  }
}
const fakeRequest: HttpRequest = {
  params: {
    items: 'any_accounnt_id_1,any_accounnt_id_2,any_accounnt_id_3'
  }
}

describe('FilterPointController', () => {
  describe('FilterPoint', () => {
    test('should call FilterPoint', async () => {
      const { sut, filterPointStub } = makeSut()
      const filterSpy = jest.spyOn(filterPointStub, 'filter')
      await sut.handle(fakeRequest)
      expect(filterSpy).toHaveBeenCalledWith([
        'any_accounnt_id_1',
        'any_accounnt_id_2',
        'any_accounnt_id_3'
      ])
    })

    test('should return 200 if FilterPoint success', async () => {
      const { sut } = makeSut()
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(ok(fakeListPointsResult()))
    })

    test('should return 204 if FilterPoints return []', async () => {
      const { sut, filterPointStub } = makeSut()
      jest
        .spyOn(filterPointStub, 'filter')
        .mockReturnValueOnce(new Promise(resolve => resolve([])))
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(noContent())
    })

    test('should return 500 if FilterPoint throws', async () => {
      const { sut, filterPointStub } = makeSut()
      jest.spyOn(filterPointStub, 'filter').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })
  })

  describe('Validator', () => {
    test('Should call Validator with correct value', async () => {
      const { sut, validatorStub } = makeSut()
      const isValidSpy = jest.spyOn(validatorStub, 'isValid')
      await sut.handle(fakeRequest)
      expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.params)
    })

    test('Should return 400 if Validator return Error', async () => {
      const { sut, validatorStub } = makeSut()
      jest
        .spyOn(validatorStub, 'isValid')
        .mockReturnValueOnce(new MissingParamsError('any_field'))
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamsError('any_field'))
      )
    })

    test('should return 500 if Validator throws', async () => {
      const { sut, validatorStub } = makeSut()
      jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })
  })
})
