import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'

export class StorageTypeAwsAdapter implements SavedImageStorage {
  async saveImage (request: any): Promise<string> {
    return new Promise(resolve => resolve('htt://any_ur.com'))
  }
}
