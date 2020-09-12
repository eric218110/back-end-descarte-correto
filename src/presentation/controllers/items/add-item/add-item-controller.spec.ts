import { AddItemController } from './add-item-controller'
import {
  HttpRequest,
  Validator
} from '../load-items/load-items-controller-protocols'
import { ItemModel } from '@domain/models/item'
import { AddItem, AddItemModel } from '@domain/usecases/item/add-item'
import {
  serverError,
  badRequest,
  noContent
} from '@presentation/helper/http/http-helper'
import {
  MissingParamsError,
  UploadFileError,
  TitleAlreadyExistError
} from '@presentation/errors'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'
import { StorageRemoveFile } from '@domain/usecases/upload/storage/storage-remove-file'

type SutTypes = {
  addItemStub: AddItem
  sut: AddItemController
  fakeRequest: HttpRequest
  validatorStub: Validator
  loadItemByTitleStub: LoadItemByTitle
  storageRemoveFileStub: StorageRemoveFile
}

const fakeItem = (): ItemModel => ({
  id: 'any_id',
  image: 'http://any_image_1.com',
  title: 'any_title_1',
  activeColor: 'any_activeColor',
  color: 'any_color'
})

const fakeRequest = (): {} => ({
  title: 'any_title_1',
  file: 'any_filename.png'
})

const fakeHttpRequest = (): HttpRequest => ({
  body: fakeRequest()
})

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAddItemStub = (): AddItem => {
  class AddItemStub implements AddItem {
    async add(item: AddItemModel): Promise<ItemModel> {
      return new Promise(resolve => resolve(fakeItem()))
    }
  }
  return new AddItemStub()
}

const makeLoadItemByTitleStub = (): LoadItemByTitle => {
  class AddItemStub implements LoadItemByTitle {
    async load(title: string): Promise<ItemModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new AddItemStub()
}

const makeStorageRemoveFileStub = (): StorageRemoveFile => {
  class StorageRemoveFileStub implements StorageRemoveFile {
    async remove(filePath: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new StorageRemoveFileStub()
}

const makeSut = (): SutTypes => {
  const loadItemByTitleStub = makeLoadItemByTitleStub()
  const addItemStub = makeAddItemStub()
  const validatorStub = makeValidatorStub()
  const storageRemoveFileStub = makeStorageRemoveFileStub()
  const sut = new AddItemController(
    addItemStub,
    validatorStub,
    loadItemByTitleStub,
    storageRemoveFileStub
  )
  const fakeRequest = fakeHttpRequest()
  return {
    sut,
    fakeRequest,
    addItemStub,
    validatorStub,
    loadItemByTitleStub,
    storageRemoveFileStub
  }
}

describe('AddItemController', () => {
  describe('AddItem', () => {
    test('should call AddItem with values correctly', async () => {
      const { sut, addItemStub, fakeRequest } = makeSut()
      const addSpy = jest.spyOn(addItemStub, 'add')
      await sut.handle(fakeRequest)
      expect(addSpy).toHaveBeenCalledWith({
        image: fakeRequest.body.file,
        title: fakeRequest.body.title
      })
    })

    test('should return 500 if AddItem throws', async () => {
      const { sut, addItemStub, fakeRequest } = makeSut()
      jest.spyOn(addItemStub, 'add').mockImplementationOnce(async () => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async () => {
      const { sut, fakeRequest } = makeSut()
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(noContent())
    })
  })

  describe('Validator', () => {
    test('Should call Validator with correct value', async () => {
      const { sut, validatorStub, fakeRequest } = makeSut()
      const isValidSpy = jest.spyOn(validatorStub, 'isValid')
      await sut.handle(fakeRequest)
      expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body)
    })

    test('Should return 400 if Validator return Error', async () => {
      const { sut, validatorStub, fakeRequest } = makeSut()
      jest
        .spyOn(validatorStub, 'isValid')
        .mockReturnValueOnce(new MissingParamsError('any_field'))
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamsError('any_field'))
      )
    })

    test('should return 500 if Validator throws', async () => {
      const { sut, validatorStub, fakeRequest } = makeSut()
      jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })
  })

  describe('File', () => {
    test('Should return 400 if field file not exist in request', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({
        body: {
          title: 'any_title_1',
          error: 'any_error_is_required'
        }
      })
      expect(httpResponse).toEqual(
        badRequest(new UploadFileError('any_error_is_required'))
      )
    })

    test('Should return 400 if error in save file', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({
        body: {
          title: 'any_title_1',
          error: 'any_error'
        }
      })
      expect(httpResponse).toEqual(badRequest(new UploadFileError('any_error')))
    })
  })

  describe('LoadItemByTitle', () => {
    test('should call LoadItemByTitle with values correctly', async () => {
      const { sut, loadItemByTitleStub, fakeRequest } = makeSut()
      const addSpy = jest.spyOn(loadItemByTitleStub, 'load')
      await sut.handle(fakeRequest)
      expect(addSpy).toHaveBeenCalledWith(fakeRequest.body.title)
    })

    test('should return 400 if title already exist', async () => {
      const { sut, loadItemByTitleStub, fakeRequest } = makeSut()
      jest
        .spyOn(loadItemByTitleStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(fakeItem())))
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(badRequest(new TitleAlreadyExistError()))
    })

    test('should return 500 if LoadItemByTitle throws', async () => {
      const { sut, loadItemByTitleStub, fakeRequest } = makeSut()
      jest
        .spyOn(loadItemByTitleStub, 'load')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })

    test('should return 204 if title not exist', async () => {
      const { sut, fakeRequest } = makeSut()
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(noContent())
    })
  })

  describe('Storage', () => {
    test('should call RemoveFileStorage with correct values if Error on save file', async () => {
      const { sut, loadItemByTitleStub, storageRemoveFileStub } = makeSut()
      jest
        .spyOn(loadItemByTitleStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(fakeItem())))
      const removeSpy = jest.spyOn(storageRemoveFileStub, 'remove')
      await sut.handle({
        body: {
          title: 'any_title_1',
          file: 'any_filename.png',
          pathFile: 'any_path_url.file'
        }
      })
      expect(removeSpy).toHaveBeenCalledWith('any_path_url.file')
    })

    test('should return 500 if RemoveFileStorage throws', async () => {
      const { sut, storageRemoveFileStub } = makeSut()
      jest
        .spyOn(storageRemoveFileStub, 'remove')
        .mockImplementationOnce(async () => {
          throw new UploadFileError('any_error_is_required')
        })
      const response = await sut.handle({
        body: {
          title: 'any_title_1',
          error: 'any_error_is_required',
          pathFile: 'any_path_url.file'
        }
      })
      expect(response).toEqual(
        badRequest(new UploadFileError('any_error_is_required'))
      )
    })
  })
})
