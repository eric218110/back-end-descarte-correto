import { FileProps } from '@domain/usecases/upload/upload-image'

export interface FileUploadProps extends FileProps{}
export interface ImageFileUploader {
  imageUpload: (file: FileUploadProps, storageType: 'LOCAL' | 'ONLINE') => Promise<void>
}
