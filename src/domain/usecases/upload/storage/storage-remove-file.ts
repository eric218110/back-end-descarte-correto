export interface StorageRemoveFile {
  remove: (pathFile: string) => Promise<boolean>
}
