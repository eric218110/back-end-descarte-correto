import { FileProps } from '@domain/usecases/upload/upload-image'
import { SavedImageStorage } from './storage/saved-image-storage'

export interface FileUploadProps extends FileProps {}
export interface ImageFileUploader {
  imageUpload: (
    file: FileUploadProps,
    saveImageStorage: SavedImageStorage
  ) => Promise<void>
}
