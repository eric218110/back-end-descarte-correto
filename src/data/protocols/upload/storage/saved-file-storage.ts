export interface SavedFileStorage {
  saveFile: (request: any) => Promise<string>
}
