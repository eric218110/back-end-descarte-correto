import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
import { promises } from 'fs'
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

  private async validateRequest (request: any): Promise<boolean> {
    if (request === undefined) {
      throw TypeError('request is required')
    }

    if (request.file === undefined) {
      throw TypeError('file is required')
    }

    try {
      await promises.stat(request.file.path)
    } catch (error) {
      throw TypeError('file path is undefined')
    }
    return true
  }

  async saveImage (request: any): Promise<string> {
    await this.validateRequest(request)
    return new Promise(resolve => resolve('htt://any_ur.com'))
  }
}
