import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
export class StorageTypeAwsAdapter implements SavedImageStorage {
  constructor (
    private readonly config: {
      AWS_ACCESS_KEY_ID: string
      AWS_SECRET_ACCESS_KEY: string
      AWS_DEFAULT_REGION: string
      AWS_BUCKET: string
      AWS_ACL: string
    }
  ) {}

  async saveImage (request: any): Promise<string> {
    if (request.file === undefined) {
      throw TypeError('file is required')
    }
    return new Promise(resolve => resolve('htt://any_ur.com'))
  }
}
