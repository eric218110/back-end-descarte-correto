export interface ImageFileUploader {
  imageUpload: (file: any) => Promise<string>
}
