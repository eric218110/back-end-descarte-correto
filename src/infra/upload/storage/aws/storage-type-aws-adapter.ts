import AWS, { S3 } from 'aws-sdk'
import fs, { promises } from 'fs'
import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
import { RemovedImageStorage } from '@data/protocols/upload/storage/remove-image-storage'
export class StorageTypeAwsAdapter
  implements SavedImageStorage, RemovedImageStorage {
  constructor(
    private readonly config: {
      AWS_ACCESS_KEY_ID: string
      AWS_SECRET_ACCESS_KEY: string
      AWS_DEFAULT_REGION: string
      AWS_BUCKET: string
      AWS_ACL: string
    }
  ) {}

  private async validateRequest(request: any): Promise<boolean> {
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

  private generateFileName(name: string): string {
    const hash = Date.now()
    const fileName = `${hash}-${name}`
    return fileName
  }

  private getInstaceAWS(): AWS.S3 {
    const {
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_DEFAULT_REGION
    } = this.config

    AWS.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION
    })

    return new AWS.S3()
  }

  private getParamsUpload(request: any): AWS.S3.PutObjectRequest {
    return {
      ContentEncoding: request.file.encoding,
      ContentType: request.file.mimetype,
      ACL: this.config.AWS_ACL,
      Bucket: this.config.AWS_BUCKET,
      Body: fs.createReadStream(request.file.path),
      Key: this.generateFileName(request.file.originalname)
    }
  }

  private getParamsRemove(key: string): AWS.S3.DeleteObjectRequest {
    return {
      Bucket: this.config.AWS_BUCKET,
      Key: key
    }
  }

  async saveImage(request: any): Promise<string> {
    await this.validateRequest(request)
    const S3 = this.getInstaceAWS()
    const params = this.getParamsUpload(request)
    try {
      const upload = await S3.upload(params).promise()
      await promises.unlink(request.file.path)
      request.body.pathFile = upload.Key
      return upload.Location
    } catch (error) {
      throw TypeError('Error invalid config')
    }
  }

  async removeImage(filePath: string): Promise<void> {
    const S3 = this.getInstaceAWS()
    const params = this.getParamsRemove(filePath)
    try {
      await S3.deleteObject(params).promise()
    } catch (error) {
      throw TypeError('Not remove file in cloud')
    }
  }
}
