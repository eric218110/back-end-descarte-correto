export interface RemovedImageStorage {
  removeImage: (filePath: string) => Promise<void>
}
