import env from '@main/config/env'
import { StorageTypeLocalAdapter } from '@infra/upload/storage/local/storage-type-local-adapter'
import { StorageTypeAwsAdapter } from '@infra/upload/storage/aws/storage-type-aws-adapter'
import { RemovedImageStorage } from '@data/protocols/upload/storage/remove-image-storage'
import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
import { UPLOAD } from '@main/constants/upload/upload-contants'

export const makeStorageTypeProxy = (): RemovedImageStorage &
  SavedImageStorage => {
  const {
    AWS_ACCESS_KEY_ID,
    AWS_ACL,
    AWS_BUCKET,
    AWS_DEFAULT_REGION,
    AWS_SECRET_ACCESS_KEY,
    HOST_STATIC_PATH,
    MODE
  } = env
  const localTypeStorage = new StorageTypeLocalAdapter(HOST_STATIC_PATH)
  const awsTypeStorage = new StorageTypeAwsAdapter({
    AWS_ACCESS_KEY_ID,
    AWS_ACL,
    AWS_BUCKET,
    AWS_DEFAULT_REGION,
    AWS_SECRET_ACCESS_KEY
  })
  if (MODE === UPLOAD.PRODUCTION) return awsTypeStorage
  if (MODE === UPLOAD.DEVELOPMENT) return localTypeStorage
  return localTypeStorage
}
