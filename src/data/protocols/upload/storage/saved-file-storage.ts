export interface SavedFileStorage {
  saveFile: (request: any, fileName: string) => Promise<void>
}
