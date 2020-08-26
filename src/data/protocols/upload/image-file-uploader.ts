import { FileProps } from '@domain/usecases/upload/upload-image'
import { SavedFileStorage } from './storage/saved-file-storage'

export interface FileUploadProps extends FileProps{}
export interface ImageFileUploader {
  imageUpload: (file: FileUploadProps, saveFileStorage: SavedFileStorage) => Promise<void>
}
