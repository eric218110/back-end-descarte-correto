import { makeStorageTypeProxy } from '../storage-type-proxy'
import { RemoveImageStorage } from '@data/usecases/upload/storage/remove/remove-image-storage'

export const makeRemoveImageStorage = (): RemoveImageStorage => {
  return new RemoveImageStorage(makeStorageTypeProxy())
}
