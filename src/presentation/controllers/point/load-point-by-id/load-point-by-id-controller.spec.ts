import { LoadPointById } from '@domain/usecases/point/load-point-by-id'
import {
  PointModel,
  HttpRequest,
  Validator,
  MissingParamsError,
  badRequest,
  serverError
} from '../add-point/add-point-controller-protocols'
import { LoadPointByIdController } from './load-point-by-id-controller'
import { ok } from '@presentation/helper/http/http-helper'

type SutTypes = {
  sut: LoadPointByIdController
  validatorStub: Validator
  loadPointByIdStub: LoadPointById
}

const fakeResultPoint: PointModel = {
  account: {
    id: 'any_accounnt_id',
    name: 'any_accounnt_name',
    email: 'any_accounnt_email',
    password: 'any_accounnt_password',
    accessToken: 'any_accounnt_accessToken',
    role: 'any_accounnt_role'
  },
  items: [
    {
      id: 'any_first_item_id',
      image: 'any_first_item_image',
      title: 'any_first_item_title',
      activeColor: 'any_activeColor',
      color: 'any_color'
    },
    {
      id: 'any_second_item_id',
      image: 'any_second_item_image',
      title: 'any_second_item_title',
      activeColor: 'any_activeColor',
      color: 'any_color'
    }
  ],
  id: 'any_point_id',
  city: 'any_point_city',
  image: 'any_point_image',
  latitude: 'any_point_latitude',
  longitude: 'any_point_longitude',
  name: 'any_point_name',
  neighborhood: 'any_neighborhood',
  reference: 'any_reference',
  street: 'any_street',
  zipCode: 'any_zipCode',
  state: 'any_point_state'
}

const fakeRequest: HttpRequest = {
  params: {
    id: 'any_accounnt_id'
  }
}

const makeLoadPointByIdStub = (): LoadPointById => {
  class LoadPointByIdStub implements LoadPointById {
    async load(id: string): Promise<PointModel> {
      return new Promise(resolve => resolve(fakeResultPoint))
    }
  }
  return new LoadPointByIdStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const loadPointByIdStub = makeLoadPointByIdStub()
  const validatorStub = makeValidatorStub()
  const sut = new LoadPointByIdController(loadPointByIdStub, validatorStub)
  return {
    sut,
    loadPointByIdStub,
    validatorStub
  }
}

describe('LoadPointByIdController', () => {
  describe('LoadPointById', () => {
    test('should call LoadPointById with value correct', async () => {
      const { sut, loadPointByIdStub } = makeSut()
      const loadSpy = jest.spyOn(loadPointByIdStub, 'load')
      await sut.handle(fakeRequest)
      expect(loadSpy).toHaveBeenCalledWith('any_accounnt_id')
    })

    test('should return 200 if LoadPointById success', async () => {
      const { sut } = makeSut()
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(ok(fakeResultPoint))
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
