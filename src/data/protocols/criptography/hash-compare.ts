export interface HashCompare {
  compare: (hash: string, compareHash: string) => Promise<boolean>
}
