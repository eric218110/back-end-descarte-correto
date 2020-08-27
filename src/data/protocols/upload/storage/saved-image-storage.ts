export interface SavedImageStorage {
  saveImage: (request: any) => Promise<string>
}
