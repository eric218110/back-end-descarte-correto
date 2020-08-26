export interface StorageSaveFile {
  save: (request: any, fileName: string) => Promise<void>
}
