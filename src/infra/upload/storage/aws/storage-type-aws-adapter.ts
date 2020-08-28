import AWS from 'aws-sdk'
import fs, { promises } from 'fs'
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

  private generateFileName (name: string): string {
    const hash = Date.now()
    const fileName = `${hash}-${name}`
    return fileName
  }

  private setConfigAWS (): void {
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
  }

  private getParamsUpload (request: any): AWS.S3.PutObjectRequest {
    return {
      ContentEncoding: request.file.encoding,
      ContentType: request.file.mimetype,
      ACL: this.config.AWS_ACL,
      Bucket: this.config.AWS_BUCKET,
      Body: fs.createReadStream(request.file.path),
      Key: this.generateFileName(request.file.originalname)
    }
  }

  async saveImage (request: any): Promise<string> {
    await this.validateRequest(request)
    this.setConfigAWS()
    const S3 = new AWS.S3()
    const params = this.getParamsUpload(request)
    try {
      const upload = await S3.upload(params).promise()
      await promises.unlink(request.file.path)
      return upload.Location
    } catch (error) {
      throw TypeError('Error invalid config')
    }
  }
}
