import { FileProps } from '@domain/usecases/upload/upload-image'
export interface ImageFileUploader {
  imageUpload: (file: FileProps) => Promise<string>
}
