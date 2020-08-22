export type FileProps = {
  request: any
  response: any
}

export interface UploadImage {
  upload: (file: FileProps) => Promise<string>
}
