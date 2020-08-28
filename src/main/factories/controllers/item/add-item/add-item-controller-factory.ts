import { Controller } from '@presentation/protocols'
import { AddItemController } from '@presentation/controllers/items/add-item/add-item-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { makeDbAddItem } from '@main/factories/usecases/item/add-item/db-add-item-factory'
import { makeAddItemValidator } from './add-item-validator-factory'
import { makeLoadItemByTitle } from '@main/factories/usecases/item/load-item-by-title/load-item-by-title'
import { StorageTypeLocalAdapter } from '@infra/upload/storage/local/storage-type-local-adapter'
import env from '@main/config/env'
import { RemoveImageStorage } from '@data/usecases/upload/storage/remove/remove-image-storage'

export const makeAddItemController = (): Controller => {
  const storageLocal = new StorageTypeLocalAdapter(env.HOST_STATIC_PATH)
  const removeFile = new RemoveImageStorage(storageLocal)
  const addItemController = new AddItemController(
    makeDbAddItem(),
    makeAddItemValidator(),
    makeLoadItemByTitle(),
    removeFile
  )
  return makeLoggerControllerDecorator(addItemController)
}
